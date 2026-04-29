<?php

namespace App\Service;

use App\DTO\RegisterDTO;
use App\Entity\User;
use App\Exception\InvalidRefreshToken;
use App\Exception\UserEmailUniqueConstraint;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AuthService
{
    public function __construct(private UserPasswordHasherInterface $passwordHasher,
                                private EntityManagerInterface      $entityManager,
                                private RefreshTokenService         $refreshTokenService,
                                private JWTTokenManagerInterface    $JWTManager)
    {
    }

    public function register(RegisterDTO $registerDTO): void
    {
        $user = new User();

        $hashedPassword = $this->passwordHasher->hashPassword($user, $registerDTO->password);

        $user->setPassword($hashedPassword)
            ->setEmail($registerDTO->email);

        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();

        } catch (UniqueConstraintViolationException $ex) {
            throw new UserEmailUniqueConstraint();
        }
    }

    public function refreshToken(string $refreshTokenString): array
    {
        $refreshToken = $this->refreshTokenService->getRefreshToken($refreshTokenString);
        if (!$refreshToken) {
            throw new InvalidRefreshToken();
        }

        if ($refreshToken->getExpiresAt() < new \DateTimeImmutable("now")) {
            $this->refreshTokenService->invalidateRefreshToken($refreshToken);
            throw new InvalidRefreshToken();
        }

        $user = $refreshToken->getOwner();

        $this->refreshTokenService->invalidateRefreshToken($refreshToken);
        $newRefreshToken = $this->refreshTokenService->generateRefreshToken($user);

        $accessToken = $this->JWTManager->create($user);

        return ['refreshToken' => $newRefreshToken, 'accessToken' => $accessToken];
    }

    public function logout(string $refreshTokenString): void
    {
        $refreshToken = $this->refreshTokenService->getRefreshToken($refreshTokenString);
        if (!$refreshToken) {
            throw new InvalidRefreshToken();
        }
        $this->refreshTokenService->invalidateRefreshToken($refreshToken);
    }

}
