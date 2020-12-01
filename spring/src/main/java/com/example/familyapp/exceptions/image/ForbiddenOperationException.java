package com.example.familyapp.exceptions.image;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.FORBIDDEN, reason="You can't delete this image")  // 403
public class ForbiddenOperationException extends RuntimeException{

}
