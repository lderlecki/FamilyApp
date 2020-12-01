from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound

from family.models import Family
from task_list.models import TodoList


def validate_task_create_request(request):
    """
    Validate whether the request meets the requirements

    If the request is valid, return ''None''.
    If request is invalid, raise ValidationError with specific error message.
    """
    responsible_person = request.data.get('profile', None)
    todolist_id = request.data.get('todolist', None)
    user = request.user

    if not todolist_id:
        raise ValidationError({"Todolist": "Todolist object not specified."})

    todolist = TodoList.objects.filter(id=int(todolist_id), family__profile=user.profile.id)

    if responsible_person is not None:
        todolist = todolist.filter(id=int(todolist_id), family__profile=int(responsible_person))
        if not todolist.exists():
            raise ValidationError(
                {"Todolist": "You are not authorized to perform this action."}
            )
    elif not todolist.exists():
        raise ValidationError(
            {"Todolist": "You cannot create task for the family that you are not a member of."}
        )


def validate_todo_create(user, data):
    """
    Validate whether the user is a member of todolist family given in data and if
    responsible persons given in tasks field are also members of this family

    If the data is valid, return ''None''.
    If data is invalid, raise Exception with specific error message.
    """
    family_id = data.get('family', None)
    if not family_id:
        raise ValidationError({"Family": "Family object not specified."})

    # check if request.user is a member of the TodoList family
    family = Family.objects.filter(id=int(family_id), profile__user_id=user.id)
    # If request.user is not a member of a family provided in data raise error
    if not family.exists():
        raise ValidationError({"User": "You cannot create todolist for the family that you are not a member of."})

    tasks = data.get('tasks', None)
    for task in tasks:
        task_profile = task.get('profile', None)
        # If responsible person is not None and is not a member of given family, then raise Exception
        if task_profile and not family.filter(profile=task_profile).exists():
            raise ValidationError(
                {"responsiblePerson": "Selected person for task is not a member of family specified in todolist."}
            )
    return


