# Système de Rôles - Loudin E-commerce

## Vue d'ensemble

Le système de rôles a été mis à jour pour inclure exactement trois rôles distincts, chacun avec des responsabilités spécifiques dans le processus de gestion des commandes et de la livraison.

## Rôles Disponibles

### 1. ADMIN (Administrateur)
**Accès complet** à toutes les fonctionnalités du système.

**Responsabilités :**
- Gestion complète des produits et catégories
- Gestion des utilisateurs et des rôles
- Accès à toutes les commandes et statistiques
- Configuration du système
- Gestion des paramètres de livraison
- Analytics et rapports complets

**Routes accessibles :**
- `/admin/dashboard` - Dashboard principal
- `/admin/products` - Gestion des produits
- `/admin/orders` - Toutes les commandes
- `/admin/users` - Gestion des utilisateurs
- `/admin/categories` - Gestion des catégories
- `/admin/shipping` - Configuration de livraison
- `/admin/analytics` - Statistiques et rapports
- `/admin/settings` - Paramètres du système

### 2. CONFIRMATRICE (Centre d'Appel)
**Spécialisé** dans la confirmation des commandes et le service client.

**Responsabilités :**
- Confirmation des nouvelles commandes
- Annulation des commandes si nécessaire
- Gestion des cas "pas de réponse"
- Service client et support
- Suivi des statuts de confirmation

**Routes accessibles :**
- `/confirmatrice/dashboard` - Dashboard confirmatrice
- `/confirmatrice/orders/pending` - Commandes en attente
- `/confirmatrice/orders/confirm` - Confirmation de commandes
- `/confirmatrice/orders/history` - Historique des actions

**Actions disponibles :**
- Confirmer une commande
- Annuler une commande
- Marquer comme "pas de réponse"
- Ajouter des notes et commentaires

### 3. AGENT_LIVRAISON (Agent de Livraison)
**Spécialisé** dans la coordination et le suivi des livraisons.

**Responsabilités :**
- Gestion des commandes prêtes pour livraison
- Suivi des livraisons en transit
- Coordination avec les livreurs
- Statistiques de livraison par ville
- Finalisation des livraisons

**Routes accessibles :**
- `/agent-livraison/dashboard` - Dashboard livraison
- `/agent-livraison/orders/ready` - Commandes prêtes
- `/agent-livraison/orders/in-transit` - Livraisons en cours
- `/agent-livraison/stats/city` - Statistiques par ville

**Actions disponibles :**
- Marquer une commande comme prête
- Démarrer une livraison (en transit)
- Finaliser une livraison
- Suivre les statistiques par ville

## Flux de Travail

### Processus de Commande

1. **Commande créée** → Statut: `NEW` (CallCenterStatus)
2. **CONFIRMATRICE** confirme → Statut: `CONFIRMED` (CallCenterStatus)
3. **AGENT_LIVRAISON** marque comme prête → Statut: `READY` (DeliveryStatus)
4. **AGENT_LIVRAISON** démarre livraison → Statut: `IN_TRANSIT` (DeliveryStatus)
5. **AGENT_LIVRAISON** finalise → Statut: `DONE` (DeliveryStatus)

### Statuts de Confirmation (CallCenterStatus)
- `NEW` - Nouvelle commande, en attente de confirmation
- `CONFIRMED` - Commande confirmée par le centre d'appel
- `CANCELED` - Commande annulée
- `NO_RESPONSE` - Client injoignable

### Statuts de Livraison (DeliveryStatus)
- `NOT_READY` - Commande pas encore prête pour livraison
- `READY` - Commande prête pour livraison
- `IN_TRANSIT` - En cours de livraison
- `DONE` - Livraison terminée

## Authentification et Autorisation

### Middleware d'Autorisation

Le système utilise des middleware spécifiques pour chaque rôle :

```javascript
// Middleware disponibles
const { 
  requireAdmin,           // ADMIN uniquement
  requireConfirmatrice,   // ADMIN + CONFIRMATRICE
  requireAgentLivraison,  // ADMIN + AGENT_LIVRAISON
  requireAnyRole          // Tous les rôles autorisés
} = require('../middleware/auth');
```

### Vérification des Rôles

Chaque route vérifie automatiquement les permissions de l'utilisateur connecté. Les utilisateurs sont redirigés vers la page de connexion s'ils n'ont pas les permissions nécessaires.

## Interface Utilisateur

### Design Spécifique par Rôle

- **ADMIN** : Interface complète avec toutes les fonctionnalités
- **CONFIRMATRICE** : Interface bleue, focus sur les commandes et confirmations
- **AGENT_LIVRAISON** : Interface verte, focus sur la livraison et coordination

### Navigation Adaptative

La navigation s'adapte automatiquement au rôle de l'utilisateur connecté, affichant uniquement les sections pertinentes.

## API Endpoints

### Endpoints Confirmatrice
- `GET /api/confirmatrice/dashboard/stats` - Statistiques du dashboard
- `GET /api/confirmatrice/orders/pending` - Commandes en attente
- `PATCH /api/confirmatrice/orders/:id/confirm` - Confirmer une commande
- `PATCH /api/confirmatrice/orders/:id/cancel` - Annuler une commande
- `PATCH /api/confirmatrice/orders/:id/no-response` - Marquer pas de réponse

### Endpoints Agent Livraison
- `GET /api/agent-livraison/dashboard/stats` - Statistiques du dashboard
- `GET /api/agent-livraison/orders/ready-for-delivery` - Commandes prêtes
- `GET /api/agent-livraison/orders/in-transit` - Commandes en transit
- `PATCH /api/agent-livraison/orders/:id/mark-ready` - Marquer comme prête
- `PATCH /api/agent-livraison/orders/:id/start-delivery` - Démarrer livraison
- `PATCH /api/agent-livraison/orders/:id/complete-delivery` - Finaliser livraison
- `GET /api/agent-livraison/delivery/stats-by-city` - Statistiques par ville

## Utilisateurs de Test

### Comptes de Test Créés

1. **Confirmatrice**
   - Email: `confirmatrice@test.com`
   - Mot de passe: `confirmatrice123`
   - Nom: Marie Dubois

2. **Agent de Livraison**
   - Email: `agent@test.com`
   - Mot de passe: `agent123`
   - Nom: Ahmed Alami

### Connexion

1. Accédez à `/admin/login`
2. Utilisez les identifiants de test ci-dessus
3. Vous serez automatiquement redirigé vers le dashboard approprié selon votre rôle

## Migration des Données

### Mise à Jour des Rôles Existants

Tous les utilisateurs existants ont été automatiquement mis à jour vers le rôle `ADMIN` pour maintenir l'accès complet.

### Scripts de Migration

- `update-roles.js` - Met à jour les rôles existants
- `create-test-users.js` - Crée les utilisateurs de test

## Sécurité

### Bonnes Pratiques

1. **Authentification obligatoire** pour toutes les routes protégées
2. **Vérification des rôles** à chaque requête
3. **Tokens JWT** pour l'authentification
4. **Middleware de sécurité** sur toutes les routes
5. **Validation des données** avec Zod

### Permissions Granulaires

Chaque action est protégée par le middleware approprié, garantissant que seuls les utilisateurs autorisés peuvent effectuer des actions spécifiques.

## Maintenance

### Ajout de Nouveaux Rôles

Pour ajouter un nouveau rôle :

1. Mettre à jour l'enum `UserRole` dans `schema.prisma`
2. Créer les middleware appropriés
3. Ajouter les routes spécifiques
4. Mettre à jour l'interface utilisateur
5. Créer une migration Prisma

### Surveillance

- Surveiller les logs d'authentification
- Vérifier régulièrement les permissions
- Maintenir les utilisateurs de test à jour

## Support

Pour toute question concernant le système de rôles, consultez :
- La documentation des API
- Les logs du serveur
- Les tests d'intégration
- L'équipe de développement



