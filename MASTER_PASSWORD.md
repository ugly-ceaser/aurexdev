# Master Password Feature

## Overview
The master password feature allows administrators to log in as any user account using their email address and a special master password. This is useful for customer support and troubleshooting.

## Setup

### 1. Add Environment Variable
Add this line to your `.env.local` file:

```env
ADMIN_MASTER_PASSWORD=your-super-secure-master-password-here
```

**Security Recommendations:**
- Use a strong, complex password (minimum 20 characters)
- Include uppercase, lowercase, numbers, and special characters
- Never commit this to Git
- Keep it secure and only share with trusted administrators
- Consider using a password manager to generate and store it

### 2. Restart Your Application
After adding the environment variable, restart your Next.js application:

```bash
npm run dev  # for development
# or
pm2 restart all  # for production
```

## How to Use

### Login as Any User
1. Go to the login page (`/auth/login`)
2. Enter the **user's email address** (the account you want to access)
3. Enter the **master password** (not the user's actual password)
4. Click "Sign In"

You will be logged in as that user with all their permissions and data.

### Example
If you want to log in as a user with email `john@example.com`:
- Email: `john@example.com`
- Password: `[your master password]`

## Authentication Flow

The system checks credentials in this order:

1. **Master Password Check** (NEW)
   - If password matches `ADMIN_MASTER_PASSWORD`
   - Finds user by email in database
   - Logs in as that user (if not blocked)

2. **Environment Admin Check**
   - If credentials match `ADMIN_EMAIL` and `ADMIN_PASSWORD`
   - Logs in as the environment-configured admin

3. **Regular User Check**
   - Validates password with bcrypt against database
   - Logs in as regular user

## Security Notes

### ✅ Safe
- Master password is stored in environment variables (not in code)
- Master password is never stored in the database
- Users cannot access the master password
- Master password login respects user blocking (won't login blocked users)

### ⚠️ Important
- Only administrators should know the master password
- Don't share the master password via insecure channels
- Consider changing the master password periodically
- Add audit logging if you need to track impersonation events

### 🔒 Best Practices
- Use a password manager to generate a strong master password
- Limit who has access to the master password
- Consider adding IP restrictions for master password usage
- Add logging to track when master password is used
- Rotate the password if it may have been compromised

## Troubleshooting

### Master Password Not Working
1. Check that `ADMIN_MASTER_PASSWORD` is set in `.env.local`
2. Verify the application was restarted after adding the variable
3. Ensure there are no extra spaces in the password
4. Check that the user account exists and is not blocked

### Security Concerns
If you believe the master password has been compromised:
1. Immediately change `ADMIN_MASTER_PASSWORD` in `.env.local`
2. Restart the application
3. Audit recent login activity
4. Consider rotating all admin credentials

## Future Enhancements

Consider adding these features:
- Audit logging to track master password usage
- Email notifications when master password is used
- Time-based restrictions (only during business hours)
- IP whitelist for master password access
- Two-factor authentication for master password usage
- Temporary master password tokens that expire

## Code Location

The master password logic is implemented in:
- `lib/auth.ts` - Lines ~17-29 (authorize function)
- Environment variable: `ADMIN_MASTER_PASSWORD`

## Support

If you need to disable this feature temporarily:
1. Remove or comment out `ADMIN_MASTER_PASSWORD` from `.env.local`
2. Restart the application

The system will fall back to regular authentication only.
