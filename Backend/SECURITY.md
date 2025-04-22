# Recommandations de Sécurité pour le Licensing Server

## Sécurisation de l'Utilisateur de Base de Données

Pour limiter les permissions de l'utilisateur de la base de données PostgreSQL, suivez ces recommandations :

1. **Créer un utilisateur dédié** : Créez un utilisateur spécifique pour l'application avec des droits restreints au lieu d'utiliser le super-utilisateur `postgres`.

```sql
CREATE USER licensing_app WITH PASSWORD 'strong_password';
```

2. **Limiter les permissions** : Accordez uniquement les privilèges nécessaires à cet utilisateur sur la base de données de l'application.

```sql
-- Accorder seulement les permissions nécessaires
GRANT CONNECT ON DATABASE licensing_db TO licensing_app;
GRANT USAGE ON SCHEMA public TO licensing_app;

-- Permissions sur les tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO licensing_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO licensing_app;

-- Pour les tables futures
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO licensing_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO licensing_app;
```

3. **Restreindre les permissions sensibles** : Ne pas accorder les privilèges suivants à l'utilisateur de l'application :
   - `SUPERUSER`
   - `CREATEDB`
   - `CREATEROLE`
   - `REPLICATION`
   - Accès en modification aux tables de système

4. **Isoler la base de données** : Configurez la connexion à la base de données pour qu'elle n'accepte que les connexions locales ou via SSL.

## Configuration Recommandée dans le fichier .env

```
# Variables d'environnement pour la base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=licensing_db
DB_USER=licensing_app
DB_PASSWORD=strong_password  # Utiliser un mot de passe fort, différent du super-utilisateur

# Utiliser SSL pour les connexions de base de données en production
DB_SSL=true
```

## Mettre à jour le code de configuration de base de données

Modifiez la configuration de la connexion à la base de données pour utiliser l'utilisateur avec privilèges limités et activer SSL en production.

## Surveillance et Audit

1. Activez la journalisation des requêtes dans PostgreSQL pour suivre les activités
2. Vérifiez régulièrement les journaux à la recherche d'activités suspectes
3. Mettez en place des alertes pour les comportements anormaux

## Notes Importantes

- N'utilisez jamais l'utilisateur `postgres` ou un super-utilisateur pour les connexions d'application
- Changez régulièrement les mots de passe de base de données
- Effectuez des revues périodiques des permissions accordées aux utilisateurs
- En production, utilisez toujours des connexions chiffrées (SSL/TLS) 