<?php

namespace App\Tests\Service;

use App\Entity\RefreshToken;
use App\Entity\User;
use App\Repository\RefreshTokenRepository;
use App\Service\RefreshTokenService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class RefreshTokenServiceTest extends TestCase
{
    private EntityManagerInterface $em;
    private RefreshTokenRepository $repository;
    private RefreshTokenService $service;

    protected function setUp(): void
    {
        $this->em = $this->createMock(EntityManagerInterface::class);
        $this->repository = $this->createMock(RefreshTokenRepository::class);

        $this->service = new RefreshTokenService(
            $this->em,
            $this->repository
        );
    }

    public function testGenerateRefreshTokenPersistsAndReturnsToken(): void
    {
        $user = new User();

        $this->em
            ->expects($this->once())
            ->method('persist')
            ->with($this->isInstanceOf(RefreshToken::class));

        $this->em
            ->expects($this->once())
            ->method('flush');

        $token = $this->service->generateRefreshToken($user);

        $this->assertSame($user, $token->getOwner());
        $this->assertNotEmpty($token->getToken());

        $this->assertEquals(128, strlen($token->getToken()));

        $this->assertGreaterThan(
            new \DateTimeImmutable(),
            $token->getExpiresAt()
        );
    }

    public function testInvalidateRefreshTokenRemovesAndFlushes(): void
    {
        $refreshToken = new RefreshToken();

        $this->em
            ->expects($this->once())
            ->method('remove')
            ->with($refreshToken);

        $this->em
            ->expects($this->once())
            ->method('flush');

        $this->service->invalidateRefreshToken($refreshToken);
    }

    public function testGetRefreshTokenReturnsTokenWhenFound(): void
    {
        $refreshToken = new RefreshToken();

        $this->repository
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['token' => 'abc'])
            ->willReturn($refreshToken);

        $result = $this->service->getRefreshToken('abc');

        $this->assertSame($refreshToken, $result);
    }

    public function testGetRefreshTokenReturnsNullWhenNotFound(): void
    {
        $this->repository
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['token' => 'invalid'])
            ->willReturn(null);

        $result = $this->service->getRefreshToken('invalid');

        $this->assertNull($result);
    }
}
