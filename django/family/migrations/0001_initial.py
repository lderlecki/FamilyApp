# Generated by Django 3.1.1 on 2020-09-24 17:19

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Family',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('budget', models.FloatField()),
                ('family_name', models.CharField(max_length=255)),
                ('group_id', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
            ],
            options={
                'db_table': 'family',
            },
        ),
    ]
