package com.portal.user.service.impl;


import com.portal.Role;
import com.portal.appliedJobs.service.AppliedJobsService;
import com.portal.appliedJobs.service.impl.AppliedJobsServiceImpl;

import com.portal.jobs.service.JobService;
import com.portal.user.Entities.RefreshToken;
import com.portal.user.Entities.User;
import com.portal.user.models.JwtRequest;
import com.portal.user.models.JwtResponse;
import com.portal.user.repository.RefreshTokenRepository;
import com.portal.user.repository.UserRepository;
import com.portal.user.security.JwtHelper;
import com.portal.user.service.RefreshTokenService;
import com.portal.user.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;

import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;

@Service
public class UserServiceImpl implements UserService {

    Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final PasswordEncoder passwordEncoder;
    private final JwtHelper jwtHelper;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JobService jobService;
    private final RefreshTokenRepository refreshTokenRepository;

    public UserServiceImpl(
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            JwtHelper jwtHelper,
            UserRepository userRepository,
            RefreshTokenService refreshTokenService, JobService jobService, RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenService = refreshTokenService;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtHelper = jwtHelper;
        this.userRepository = userRepository;
        this.jobService = jobService;

        this.refreshTokenRepository = refreshTokenRepository;
    }

    private boolean isRefreshTokenValid(RefreshToken refreshToken) {
        return refreshToken != null && refreshToken.getExpireMs().isAfter(Instant.now());
    }

    private JwtResponse generateTokens(User user) {
        RefreshToken refreshToken = user.getRefreshToken();

        if (!isRefreshTokenValid(refreshToken)) {
            return null;
        }

        String accessToken = jwtHelper.generateTokenFromUsername(user.getUsername());

        return JwtResponse.builder()
                .username(user.getEmail())
                .jwtToken(accessToken)
                .refreshToken(refreshToken.getRefreshToken())
                .build();
    }

    private Boolean isHr(String email) {
        Set<String> emailSet = new TreeSet<>();
        emailSet.add("keshav.iesbpl@gmail.com");
        emailSet.add("iamayush891@gmail.com");
        emailSet.add("ommohangaur029@gmail.com");
        emailSet.add("mdjunaid8352@gmail.com");
        emailSet.add("ravirajvishwakarma76321@gmail.com");
        return emailSet.contains(email);
    }

    @Override
    public ResponseEntity<JwtResponse> createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new IllegalStateException("User already exists with this email");
        }


        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(isHr(user.getEmail()) ? Role.HR : Role.APPLICANT);
        user.setCreatedAt(LocalDateTime.now());

        RefreshToken refreshToken = refreshTokenService.createToken(user.getEmail()).getBody();
        user.setRefreshToken(refreshToken);

        userRepository.save(user);

        JwtResponse jwtResponse = generateTokens(user);
        return ResponseEntity.ok(jwtResponse);
    }




    @Override
    public ResponseEntity<JwtResponse> loginUser(JwtRequest request) {
        User user = authenticate(request);

        RefreshToken refreshToken = refreshTokenService.createToken(user.getEmail()).getBody();
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        JwtResponse jwtResponse = generateTokens(user);
        if (jwtResponse == null) {
            throw new IllegalStateException("Refresh token is invalid or expired");
        }

        return ResponseEntity.ok(jwtResponse);
    }

    private User authenticate(JwtRequest input) {
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword());

        try {
            authenticationManager.authenticate(authentication);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid email or password");
        }

        return Optional.ofNullable(userRepository.findByEmail(input.getEmail()))
                .orElseThrow(() -> new IllegalStateException("User not found with email: " + input.getEmail()));
    }
    @Override
    public ResponseEntity<User> getUser(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalStateException("User not found");
        }
        if (!isRefreshTokenValid(user.getRefreshToken())) {
            throw new IllegalStateException("Refresh token expired. Please login again.");
        }

        return ResponseEntity.ok(user);
    }

    @Override
    public ResponseEntity<String> updateUser(String email, User updated) {
        User existing = userRepository.findByEmail(email);
        if (existing == null) {
            throw new IllegalStateException("User not found");
        }
        if (updated.getPassword() != null && !updated.getPassword().isEmpty()) {
            if (!passwordEncoder.matches(updated.getPassword(), existing.getPassword())) {
                existing.setPassword(passwordEncoder.encode(updated.getPassword()));
                userRepository.save(existing);
                return ResponseEntity.ok("password updated successfully");
            }
        }
        validateGitHubUrl(updated.getGitHubUrl());
        validateLinkedInUrl(updated.getLinkedInUrl());
        validatePanCard(updated.getPanCard());

        applyUserUpdates(existing, updated);
        userRepository.save(existing);

        return ResponseEntity.ok("User updated successfully");
    }
    private void validateGitHubUrl(String newGitHubUrl) {
        if (newGitHubUrl == null) return;

        if (!newGitHubUrl.matches("^https://github\\.com/[A-Za-z0-9-]+/?$")) {
            throw new IllegalStateException("Invalid GitHub URL format");
        }

        if (userRepository.existsByGitHubUrl(newGitHubUrl)) {
            throw new IllegalStateException("GitHub profile already in use");
        }
    }
    private void validateLinkedInUrl(String newLinkedInUrl) {
        if (newLinkedInUrl == null) return;

        if (!newLinkedInUrl.matches("^https://(www\\.)?linkedin\\.com/in/[A-Za-z0-9_-]+/?$")) {
            throw new IllegalStateException("Invalid LinkedIn URL format");
        }

        if (userRepository.existsByLinkedInUrl(newLinkedInUrl)) {
            throw new IllegalStateException("LinkedIn profile already in use");
        }
    }
    private void validatePanCard(String newPan) {
        if (newPan == null) return;

        if (!newPan.matches("^[A-Z]{5}[0-9]{4}[A-Z]$")) {
            throw new IllegalStateException("Invalid PAN card format");
        }

        if (userRepository.existsByPanCard(newPan)) {
            throw new IllegalStateException("PAN Card already in use");
        }
    }
    private void applyUserUpdates(User existing, User updated) {
        existing.setCompanyName(updated.getCompanyName());
        existing.setGitHubUrl(updated.getGitHubUrl());
        existing.setPanCard(updated.getPanCard());
        existing.setLinkedInUrl(updated.getLinkedInUrl());
    }



//    @Override
//    public ResponseEntity<String> deleteUser(String email) {
//        User user = userRepository.findByEmail(email);
//        if (user == null) {
//            throw new IllegalStateException("User not found");
//        }
//
//        if (user.getRole() == Role.HR) {
//            jobService.getJobsByEmail(user.getEmail()).forEach(job -> {
//                jobService.deleteJob(job.getId(), job.getEmail());
//            });
//        }
//        RefreshToken refreshToken = refreshTokenRepository.findByUserEmail(user.getEmail());
//        if (refreshToken != null) {
//            refreshTokenRepository.delete(refreshToken);
//        }
//        userRepository.delete(user);
//        return ResponseEntity.ok("User deleted successfully");
//    }
}
