package com.basilium.redis.email.repository;

import com.basilium.redis.email.domain.Email;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailRepository extends CrudRepository<Email, String> {
    Optional<Email> findByEmail(String email);
}
