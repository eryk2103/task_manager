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

    public function csrfToken(): Cookie
    {
        $token = bin2hex(random_bytes(64));

        return Cookie::create('csrf_token', $token)
            ->withHttpOnly(false)
            ->withSecure(true)
            ->withSameSite('Lax');
    }
}
