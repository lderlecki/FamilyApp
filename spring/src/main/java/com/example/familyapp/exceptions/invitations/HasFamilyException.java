package com.example.familyapp.exceptions.invitations;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.CONFLICT, reason="This user has family.")  // 409
public class HasFamilyException extends RuntimeException{

}
