# Backend API Soussou

Backend Laravel avec base de données SQLite pour l'application d'apprentissage de la langue Soussou.

## 🚀 Fonctionnalités

Ce backend gère toute la logique métier et les données, permettant d'alléger considérablement le frontend :

### ✅ Gestion des nombres
- Récupération de nombres aléatoires selon la difficulté
- Vérification automatique des réponses utilisateur
- Analyse détaillée et explication de la construction des nombres
- Support des traductions alternatives

### ✅ Authentification complète
- Inscription et connexion avec Laravel Sanctum
- Gestion des tokens d'authentification
- Modification de profil et changement de mot de passe
- Support multilingue (fr, en, es, pt)

### ✅ Système de progression
- Suivi automatique des scores et statistiques
- Enregistrement des sessions de jeu
- Calcul du taux de réussite
- Système d'accomplissements (achievements)
- Classement (leaderboard)

### ✅ Modes de jeu
- Génération de quiz avec choix mult iples
- Vérification automatique des réponses
- Statistiques par mode de jeu et difficulté
- Support pour: exploration, QCM, défis chronométrés, leçons

### ✅ Alphabet Soussou
- Données complètes pour l'alphabet post-1988 et pré-1988
- Voyelles, consonnes, digraphes et tons
- Génération d'exercices de correspondance
- Mots exemples avec IPA

### ✅ Gestion de contenu
- Système de blog pour découvertes culturelles
- Formulaires de contact
- Demandes de partenariat
- Panneau d'administration

## 📋 Prérequis

- PHP 8.1 ou supérieur
- Composer
- SQLite (inclus avec PHP)

## 🛠️ Installation

1. **Installer les dépendances**
```bash
cd sosso-backend
composer install
```

2. **Configurer l'environnement**
```bash
cp .env.example .env
```

3. **Générer la clé d'application**
```bash
php artisan key:generate
```

4. **Créer la base de données et exécuter les migrations**
```bash
touch database/database.sqlite
php artisan migrate:fresh
```

5. **Peupler la base de données**
```bash
php artisan db:seed
```

6. **Démarrer le serveur**
```bash
php artisan serve
```

Le serveur sera accessible à `http://localhost:8000`

## 📚 Documentation API

### Routes publiques

#### Santé de l'API
```
GET /api/health
```

#### Authentification
```
POST /api/v1/register - Inscription
POST /api/v1/login - Connexion
```

#### Nombres
```
GET /api/v1/numbers/random?difficulty=easy - Nombre aléatoire
GET /api/v1/numbers/{value} - Obtenir un nombre spécifique
GET /api/v1/numbers - Liste paginée
POST /api/v1/numbers/check-answer - Vérifier une réponse
GET /api/v1/numbers/{id}/analyze - Analyse détaillée
```

#### Alphabet
```
GET /api/v1/alphabet?orthography=post1988 - Alphabet complet
GET /api/v1/alphabet/vowels?category=short - Voyelles
GET /api/v1/alphabet/consonants - Consonnes
GET /api/v1/alphabet/digraphs - Digraphes
GET /api/v1/alphabet/exercise/match - Exercice de correspondance
```

#### Jeux
```
POST /api/v1/game/quiz/generate - Générer un quiz
POST /api/v1/game/quiz/check - Vérifier les réponses
GET /api/v1/game/stats/global - Statistiques globales
```

#### Contact
```
POST /api/v1/contact - Envoyer un message
POST /api/v1/partnership - Demande de partenariat
```

### Routes protégées (authentification requise)

#### Profil utilisateur
```
GET /api/v1/me - Profil actuel
PUT /api/v1/profile - Mettre à jour le profil
POST /api/v1/password/change - Changer le mot de passe
POST /api/v1/logout - Déconnexion
```

#### Progression
```
GET /api/v1/progress - Progression de l'utilisateur
GET /api/v1/dashboard - Tableau de bord complet
PUT /api/v1/progress/difficulty - Changer la difficulté
POST /api/v1/progress/achievement - Ajouter un accomplissement
DELETE /api/v1/progress/reset - Réinitialiser la progression
GET /api/v1/leaderboard?period=week - Classement
```

#### Sessions de jeu
```
POST /api/v1/game/session - Sauvegarder une session
GET /api/v1/game/sessions?game_mode=exploration - Historique
```

### Routes admin (droits administrateur requis)

#### Blog
```
POST /api/v1/blog - Créer un article
PUT /api/v1/blog/{id} - Modifier
DELETE /api/v1/blog/{id} - Supprimer
POST /api/v1/blog/{id}/publish - Publier
```

#### Gestion
```
GET /api/v1/admin/contacts - Tous les messages
PUT /api/v1/admin/contacts/{id}/read - Marquer comme lu
GET /api/v1/admin/partnerships - Toutes les demandes
PUT /api/v1/admin/partnerships/{id}/status - Changer le statut
```

## 🗄️ Structure de la base de données

### Tables principales

- **users** - Utilisateurs avec authentification
- **numbers** - Nombres et leurs traductions en soussou
- **alphabet** - Lettres de l'alphabet soussou
- **user_progress** - Progression globale des utilisateurs
- **game_sessions** - Sessions de jeu individuelles
- **contacts** - Messages de contact
- **partnerships** - Demandes de partenariat
- **blog_posts** - Articles de blog

## 🔒 Sécurité

- Authentification via Laravel Sanctum (tokens API)
- Validation complète des données entrantes
- Protection CORS configurée
- Middleware d'administration pour les routes sensibles
- Hachage sécurisé des mots de passe

## 🌐 CORS

Le backend accepte les requêtes depuis:
- http://localhost:5173 (Vite dev)
- http://localhost:3000
- Configurable via `FRONTEND_URL` dans `.env`

## 🎯 Logique métier déportée du frontend

Toute la logique complexe est maintenant gérée par le backend:

1. **Vérification des réponses** : Le frontend envoie simplement la réponse, le backend vérifie et retourne le résultat
2. **Génération de nombres** : Algorithmes de sélection selon difficulté côté serveur
3. **Calcul des scores** : Automatique lors de l'enregistrement des sessions
4. **Statistiques** : Calculées en temps réel par des requêtes SQL optimisées
5. **Gestion des accomplissements** : Logique serveur avec persistance immédiate
6. **Quiz** : Génération des questions et options incorrectes par le backend

## 📦 Données fournies

### Nombres
- 40+ nombres avec traductions complètes
- Explications de construction
- Alternatives orthographiques
- Décomposition détaillée
- Classification par difficulté (easy, medium, hard)

### Alphabet
- 30+ lettres (post-1988 et pré-1988)
- Notation IPA
- Exemples de mots
- Classification (voyelles, consonnes, digraphes, tons)

## 🚀 Déploiement

### En production

1. Configurer `.env` pour la production
2. Optimiser l'autoloader:
```bash
composer install --optimize-autoloader --no-dev
```

3. Mettre en cache la configuration:
```bash
php artisan config:cache
php artisan route:cache
```

4. Configurer un serveur web (Nginx/Apache)

### Variables d'environnement importantes

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com

DB_CONNECTION=sqlite

SANCTUM_STATEFUL_DOMAINS=votre-domaine.com
FRONTEND_URL=https://votre-frontend.com
```

## 🔧 Commandes utiles

```bash
# Rafraîchir la base
php artisan migrate:fresh --seed

# Créer un utilisateur admin (à implémenter)
php artisan tinker
>>> $user = User::create(['name' => 'Admin', 'email' => 'admin@sosso.com', 'password' => Hash::make('password'), 'is_admin' => true]);

# Nettoyer le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Tests (à implémenter)
php artisan test
```

## 📝 Licence

Ce projet est sous licence MIT.

## 👥 Contribution

Les contributions sont les bienvenues ! Merci de respecter le code style PSR-12.

---

**Développé avec ❤️ pour l'apprentissage de la langue Soussou**
