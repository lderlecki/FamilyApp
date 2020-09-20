package com.example.familyapp;

import com.example.familyapp.dao.FamilyRepository;
import com.example.familyapp.dao.ProfileRepository;
import com.example.familyapp.model.Family;
import com.example.familyapp.model.Profile;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FamilyappApplication {

    public static void main(String[] args) {
        SpringApplication.run(FamilyappApplication.class, args);
    }

//    @Bean
//    ApplicationRunner applicationRunner(ProfileRepository profileRepository, FamilyRepository familyRepository){
//        return args -> {
//            Profile p=new Profile();
//            p.setName("Janek");
//            p.setSurname("Kowalski");
//            Family f=new Family();
//            f.setFamilyName("Kowalscy");
//            familyRepository.save(f);
//            p.setFamily(f);
//            p.setFamilyHead(true);
//            Profile p2=new Profile();
//            p2.setName("John");
//            p2.setSurname("Smith");
//            p2.setFamily(f);
//            profileRepository.save(p);
//            profileRepository.save(p2);
//        };
//    }
}
