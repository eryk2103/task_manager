<?php

namespace App\EventListener;

use App\Entity\User;
use App\Factory\CookieFactory;
use App\Service\RefreshTokenService;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\Cookie;

class AuthenticationSuccessListener
{
    public function __construct(private RefreshTokenService $refreshTokenService, private CookieFactory $cookieFactory) {}
    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event)
    {
        $data = $event->getData();
        $user = $event->getUser();

        if (!$user instanceof User) {
            throw new \Exception("AuthenticationSuccessListener: user is not of type App\Entity\User");
        }


        $data['user'] = [
            'email' => $user->getEmail(),
        ];

        $event->setData($data);
        $refreshToken = $this->refreshTokenService->generateRefreshToken($user);

        $response = $event->getResponse();
        $response->headers->setCookie($this->cookieFactory->refreshToken($refreshToken));
    }
}
