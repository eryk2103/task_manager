<?php

namespace App\Factory;

use App\Entity\RefreshToken;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\Cookie;

class CookieFactory
{
    public function __construct(private ParameterBagInterface $parameterBag)
    {
    }

    public function refreshToken(RefreshToken $refreshToken): Cookie
    {
        return Cookie::create('refresh_token', $refreshToken->getToken())
            ->withHttpOnly(true)
            ->withSecure(true)
            ->withSameSite('Lax')
            ->withExpires($refreshToken->getExpiresAt());
    }

    public function accessToken(string $accessToken): Cookie
    {
        $ttl = $this->parameterBag->get('lexik_jwt_authentication.token_ttl');

        return Cookie::create('BEARER', $accessToken)
            ->withHttpOnly(true)
            ->withSecure(true)
            ->withSameSite('Lax')
            ->withExpires(new \DateTimeImmutable("+ {$ttl} seconds"));
    }
}
