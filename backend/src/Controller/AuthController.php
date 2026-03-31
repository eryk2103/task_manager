<?php

namespace App\Controller;

use App\DTO\RegisterDTO;
use App\Entity\User;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;
use Symfony\Component\Serializer\Exception\UnexpectedValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('api')]
class AuthController extends AbstractController
{
    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, ValidatorInterface $validator, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        try {
            $data = $serializer->deserialize($request->getContent(), RegisterDTO::class, 'json');
        } catch (NotNormalizableValueException | UnexpectedValueException $ex) {
            return $this->json(['error' => 'Invalid data'], 400);
        }

        $errors = $validator->validate($data);
        if (count($errors) > 0) {
            $violations = $this->formatErrors($errors);
            return $this->json(['errors' => $violations], 400);
        }


        $user = new User();
        $hashedPassword = $passwordHasher->hashPassword($user, $data->password);
        $user->setPassword($hashedPassword)
            ->setEmail($data->email);

        try {
            $em->persist($user);
            $em->flush();
        } catch (UniqueConstraintViolationException $ex) {
            return $this->json(['errors' => ['email' => 'email already in use']], 409);
        }

        return $this->json(['email' => $user->getEmail()], 200);
    }

    #[Route('/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        $response = new JsonResponse();

        $response->headers->clearCookie(
            'BEARER',
            '/',
            null,
            true,
            true
        );

        return $response;
    }

    #[Route('/me', name: 'api_me', methods: ['GET'])]
    public function me(#[CurrentUser] $user): JsonResponse
    {
        return $this->json(['email' => $user->getEmail()]);
    }

    private function formatErrors($errors): array
    {
        $result = [];
        foreach ($errors as $error) {
            $result[$error->getPropertyPath()][] = $error->getMessage();
        }
        return $result;
    }
}
