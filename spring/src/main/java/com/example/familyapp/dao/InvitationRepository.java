package com.example.familyapp.dao;

import com.example.familyapp.model.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface InvitationRepository extends JpaRepository<Invitation, Long> {

    List<Invitation> findAllByFamilyId(long familyId);
    List<Invitation> findAllByProfileId(long profileId);
}
