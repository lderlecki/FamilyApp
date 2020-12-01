package com.example.familyapp.exceptions.invitations;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.CONFLICT, reason="Invitation already exists")  // 409
public class AlreadyInvitedException extends RuntimeException{

}
