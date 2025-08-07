# App Store Submission Guide for Dopamax

## ✅ Completed Setup

### App Configuration
- ✅ Bundle Identifier: `com.aprameyakannan.dopamax`
- ✅ Version: 1.0.0
- ✅ Build Number: 1 (iOS)
- ✅ Version Code: 1 (Android)
- ✅ Privacy Policy: Created

## 📋 Required Steps for App Store Submission

### 1. App Store Connect Setup

1. **Create App Store Connect Account**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Sign in with your Apple ID
   - Accept the Apple Developer Agreement

2. **Create App Record**
   - Click "My Apps" → "+" → "New App"
   - Platform: iOS
   - Name: Dopamax
   - Bundle ID: `com.aprameyakannan.dopamax`
   - SKU: `dopamax-ios` (unique identifier for your use)
   - User Access: Full Access

### 2. App Information (Required)

#### App Description
```
Dopamax - Turn tasks into dopamine hits

Transform your daily tasks into rewarding achievements with Dopamax, the productivity app that makes completing tasks feel like winning.

FEATURES:
• Simple task management - add, complete, and delete tasks
• Visual progress tracking with beautiful progress bars
• Dopamine score tracking for completed tasks
• Clean, intuitive interface designed for focus
• Local data storage - your data stays on your device
• No ads, no tracking, just pure productivity

Perfect for anyone who wants to gamify their productivity and build better habits. Each completed task gives you a dopamine hit, making productivity addictive in the best way.

Download Dopamax today and start turning your to-dos into dopamine!
```

#### Keywords
```
productivity,task,manager,to-do,list,habits,dopamine,gamification,focus,goals,achievement,progress,tracking,simple,clean,minimal
```

#### App Store Categories
- Primary: Productivity
- Secondary: Lifestyle

### 3. Screenshots (Required)

You need screenshots for these device sizes:
- iPhone 6.7" (1290 x 2796)
- iPhone 6.5" (1242 x 2688)
- iPhone 5.5" (1242 x 2208)
- iPad Pro 12.9" (2048 x 2732)

**Screenshot Ideas:**
1. Main screen with tasks and progress bar
2. Adding a new task
3. Completed tasks view
4. Empty state with motivational message

### 4. App Preview Video (Optional but Recommended)

Create a 15-30 second video showing:
- App launch
- Adding a task
- Completing a task
- Progress tracking

### 5. App Store Review Information

#### Contact Information
- **First Name:** Aprameya
- **Last Name:** Kannan
- **Email:** aprameyakannan@gmail.com
- **Phone:** [Your phone number]

#### Review Notes
```
Dopamax is a simple task management app that helps users track their productivity with a dopamine-based reward system. 

Key features:
- Add, complete, and delete tasks
- Visual progress tracking
- Local data storage (no cloud sync)
- Clean, minimal interface

The app stores all data locally on the device using SQLite. No personal data is collected or transmitted to external servers.

Testing instructions:
1. Launch the app
2. Add a few tasks using the input field
3. Tap tasks to mark them as complete
4. View progress bar and dopamine counter
5. Toggle between showing/hiding completed tasks
6. Delete tasks using the X button

All functionality is self-contained and requires no external accounts or services.
```

### 6. Build and Submit

#### Create Production Build
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Create production build for iOS
eas build --platform ios --profile production

# Create production build for Android
eas build --platform android --profile production
```

#### Submit to App Store
```bash
# Submit iOS build
eas submit --platform ios

# Submit Android build
eas submit --platform android
```

### 7. Additional Requirements

#### Privacy Policy URL
Upload the `PRIVACY_POLICY.md` to a public URL (GitHub Pages, etc.) and provide the link in App Store Connect.

#### App Store Guidelines Compliance
- ✅ No ads or in-app purchases
- ✅ No data collection
- ✅ No external dependencies
- ✅ Appropriate content rating (4+)

#### Content Rating
- Age Rating: 4+
- Violence: None
- Sexual Content: None
- Language: None
- Controlled Substances: None
- Mature/Suggestive Themes: None

### 8. Testing Checklist

Before submitting, test:
- ✅ App launches without crashes
- ✅ All features work on different screen sizes
- ✅ Database operations work correctly
- ✅ Error handling works properly
- ✅ UI is responsive and accessible
- ✅ No console errors in production build

### 9. Common Rejection Reasons to Avoid

- Missing privacy policy
- App crashes during review
- Incomplete app information
- Poor app description or keywords
- Missing screenshots
- App doesn't work as described

## 🚀 Next Steps

1. Create App Store Connect account
2. Set up app record with provided information
3. Prepare screenshots and video
4. Create production build
5. Submit for review

**Estimated Review Time:** 1-3 days

## 📞 Support

If you encounter issues during submission:
- Apple Developer Support: https://developer.apple.com/contact/
- Expo Support: https://expo.canny.io/ 