<?php

namespace App\EventListener;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;

class AuthenticationSuccessListener
{
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
    }
}
