<?php

namespace App\Repository;

use App\Entity\Task;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Task>
 */
class TaskRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Task::class);
    }

    public function findByOwner($user, $status = ''): array
    {
        $qb = $this->createQueryBuilder('t')
            ->innerJoin('t.project', 'p')
            ->andWhere("p.owner = :user")
            ->setParameter('user', $user);

        if ($status != '') {
            $qb = $qb->andWhere("t.status = :status")
                ->setParameter('status', strtoupper($status));
        }

        return $qb->getQuery()
            ->getResult();
    }

    public function findOneByOwner($user, $id): ?Task
    {
        return $this->createQueryBuilder('t')
            ->innerJoin('t.project', 'p')
            ->andWhere("p.owner = :user")
            ->setParameter('user', $user)
            ->andWhere('t = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function findByOwnerAndProject($user, $project, $status = '', int $page = 1, int $limit = 20): array
    {
        $offset = ($page - 1) * $limit;

        $qb = $this->createQueryBuilder('t')
            ->innerJoin('t.project', 'p')
            ->andWhere("p.owner = :user")
            ->setParameter('user', $user)
            ->andWhere("p = :project")
            ->setParameter('project', $project);

        if ($status != '') {
            $qb = $qb->andWhere("t.status = :status")
                ->setParameter('status', strtoupper($status));
        }

        $qb->setFirstResult($offset)
            ->setMaxResults($limit);

        $paginator = new Paginator($qb->getQuery());

        return [
            'data' => iterator_to_array($paginator),
            'total' => count($paginator),
        ];
    }

    //    /**
    //     * @return Task[] Returns an array of Task objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('t.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Task
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
