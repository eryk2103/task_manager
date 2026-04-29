<?php

namespace App\Controller;

use App\DTO\RegisterDTO;
use App\Factory\CookieFactory;
use App\Service\AuthService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('api/auth', name: 'api_auth_')]
class AuthController extends AbstractController
{
    public function __construct(private AuthService $authService) {}
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(#[MapRequestPayload] RegisterDTO $registerDTO): JsonResponse
    {
        $this->authService->register($registerDTO);
        return $this->json(null, 204);
    }

    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->cookies->get('refresh_token'));

        $response = new JsonResponse(null, 204);

        $response->headers->clearCookie(
            'refresh_token',
            '/',
            null,
            true,
            true
        );

        return $response;
    }

    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(#[CurrentUser] $user): JsonResponse
    {
        return $this->json(['email' => $user->getEmail()]);
    }

    #[Route('/refresh', name: 'refresh', methods: ['POST'])]
    public function refresh(Request $request, CookieFactory $cookieFactory): JsonResponse
    {
        $csrfCookie = $request->cookies->get('csrf_token');
        $csrfHeader = $request->headers->get('X-Csrf-Token');
        $refreshTokenCookie = $request->cookies->get('refresh_token', '');

        if(!($csrfCookie && $csrfHeader && hash_equals($csrfCookie, $csrfHeader))) {
            return new JsonResponse(null, 403);
        }

        $tokens = $this->authService->refreshToken($refreshTokenCookie);

        $refreshToken = $tokens['refreshToken'];
        $accessToken = $tokens['accessToken'];

        $response = new JsonResponse(['token' => $accessToken], 200);

        $response->headers->setCookie($cookieFactory->refreshToken($refreshToken));
        $response->headers->setCookie($cookieFactory->csrfToken());
        return $response;
    }
}
