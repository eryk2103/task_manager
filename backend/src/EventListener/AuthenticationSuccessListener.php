<?php

namespace App\EventListener;

use App\Entity\User;
use App\Service\RefreshTokenService;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\Cookie;

class AuthenticationSuccessListener
{
    public function __construct(private RefreshTokenService $refreshTokenService) {}
    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event)
    {
        $data = $event->getData();
        $user = $event->getUser();

        if (!$user instanceof User) {
            throw new \Exception("AuthenticationSuccessListner: user is not of type App\Entity\User");
        }


        $data['user'] = [
            'email' => $user->getEmail(),
        ];

        $event->setData($data);
        $refreshToken = $this->refreshTokenService->generateRefreshToken($user);

        $cookie = Cookie::create('refresh_token', $refreshToken->getToken())
            ->withHttpOnly(true)
            ->withSecure(true)
            ->withSameSite('Lax')
            ->withExpires($refreshToken->getExpiresAt());

        $response = $event->getResponse();
        $response->headers->setCookie($cookie);
    }
}
