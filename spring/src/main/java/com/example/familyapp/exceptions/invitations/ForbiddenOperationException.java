package com.example.familyapp.exceptions.invitations;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.FORBIDDEN, reason="You can't accept/delete this inviation")  // 403
public class ForbiddenOperationException extends RuntimeException{

}
