# Admin setup

The admin dashboard lives at `/admin`. Only people on the `admins` list can use it. Do this once.

## 1. Create your account

1. In the Supabase dashboard open Authentication, then Users.
2. Click Add user, then Create new user.
3. Enter your email and a strong, unique password. Keep Auto Confirm User checked, then create the user.

## 2. Make it an admin

1. Open SQL Editor and start a new query.
2. Paste this, replacing the email with the one you just used, and click Run:

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'you@example.com';
```

## 3. Turn off public sign-ups

Open Authentication, then Sign In / Providers, switch off Allow new users to sign up, and save. Existing users can still sign in; nobody new can register. Even if you switch it back on, only people listed in `admins` can use the dashboard.

## 4. Sign in

Go to `/admin/login` (for example http://localhost:3000/admin/login) and sign in.

## Adding or removing admins

- Add: create the user as in step 1, then run the SQL from step 2 with their email.
- Remove: delete their row from the `admins` table in Table Editor.

## If sign-in fails

- "Wrong email or password": check the email and password in Authentication, Users.
- "Your email isn't confirmed yet": open that user in Authentication, Users and confirm them.
- "This account doesn't have admin access": run the SQL in step 2 for that email.
