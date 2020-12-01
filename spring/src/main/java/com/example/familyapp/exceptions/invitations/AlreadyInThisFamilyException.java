package com.example.familyapp.exceptions.invitations;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.NOT_ACCEPTABLE, reason="This user is already member of this family")  // 406
public class AlreadyInThisFamilyException extends RuntimeException{

}
