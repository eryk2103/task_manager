<?php

namespace App\Service;

use App\Entity\RefreshToken;
use App\Repository\RefreshTokenRepository;
use Doctrine\ORM\EntityManagerInterface;

class RefreshTokenService
{
    public function __construct(private EntityManagerInterface $entityManager, private RefreshTokenRepository $refreshTokenRepository) {}
    public function generateRefreshToken($user): RefreshToken
    {
        $refreshToken = new RefreshToken();
        $refreshToken->setOwner($user)
            ->setExpiresAt(new \DateTimeImmutable("+ 1 day"))
            ->setToken($this->generateRandomToken());

        $this->entityManager->persist($refreshToken);
        $this->entityManager->flush();

        return $refreshToken;
    }

    public function invalidateRefreshToken(RefreshToken $refreshToken): void
    {
        $this->entityManager->remove($refreshToken);
        $this->entityManager->flush();
    }

    public function getRefreshToken(string $token): RefreshToken|null
    {
        return $this->refreshTokenRepository->findOneBy(['token' => $token]);
    }
    private function generateRandomToken(): string
    {
        return bin2hex(random_bytes(64));
    }
}
