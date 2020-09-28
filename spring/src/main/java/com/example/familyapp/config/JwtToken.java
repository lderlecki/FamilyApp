package com.example.familyapp.config;

import java.io.Serializable;
import java.util.Date;
import java.util.function.Function;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.familyapp.model.User;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;

@Component
public class JwtToken implements Serializable {

    private static final long ACCESS_TOKEN_VALIDITY_SECONDS = 5 * 60 * 60;
    private static final String SIGNING_KEY = "qwerty12#";
    public static final String HEADER_STRING = "Authorization";
    private static final String ISSUER = "http://company.com";

    public String generateToken(User user) {
        return doGenerateToken(user);
    }

    public Boolean validateToken(String token) { //, UserDetails userDetails
       //getUserNameFromToken
        return !isTokenExpired(token); //uesrname.equals(userDetails.getUsername()) &&
    }

    public Integer getIdFromToken(String token) {
        return (Integer)getAllClaimsFromToken(token).get("user_id");
    }



    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    private Date getExpirationDateFromToken(String token) { ;
        return getClaimFromToken(token, Claims::getExpiration);
    }

private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = getAllClaimsFromToken(token);
    return claimsResolver.apply(claims);
}

    private Claims getAllClaimsFromToken(String token) {
        //CHECK TOKEN SIGNING KEY AND ISSUER DIRECTLY HERE with HS256 mechanism
        //#TODO SET ISSUER IN DJANGO AND UNCOMMENT LINE 60
        try {
            Algorithm algorithm = Algorithm.HMAC256(SIGNING_KEY);
            JWTVerifier verifier = JWT.require(algorithm)
                    //.withIssuer(ISSUER)
                    .build(); //Reusable verifier instance
            DecodedJWT jwt = verifier.verify(token);
        } catch (JWTVerificationException exception){
            throw new JWTVerificationException("Invalid signing key");
        }
        return new MyJwtParser()
                .setSigningKey(SIGNING_KEY).parseClaimsJws(token).getBody();
    }

    private String doGenerateToken(User user) {

        //HS256 mechanism
        Algorithm algorithm = Algorithm.HMAC256(SIGNING_KEY);
        return JWT.create()
                .withClaim("user_id", user.getId())
                .withClaim("token_type", "access")
                .withClaim("exp", new Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY_SECONDS * 1000))
                .sign(algorithm);
    }

}
