# App Store Screenshot Guide for Dopamax

## 📱 **Required Screenshot Dimensions:**

### **iPhone Screenshots (Required):**
- **iPhone 6.7" (iPhone 15 Pro Max):** 1290 × 2796px
- **iPhone 6.5" (iPhone 14 Plus):** 1242 × 2688px
- **iPhone 5.5" (iPhone 8 Plus):** 1242 × 2208px

### **iPad Screenshots (Optional but Recommended):**
- **iPad Pro 12.9":** 2048 × 2732px

## 🚀 **How to Take Screenshots:**

### **Option 1: iOS Simulator (Recommended)**

1. **Open iOS Simulator:**
   ```bash
   # Open iPhone 15 Pro Max simulator
   open -a Simulator
   ```

2. **Select Device:**
   - iPhone 15 Pro Max (6.7")
   - iPhone 14 Plus (6.5")
   - iPhone 8 Plus (5.5")

3. **Run Your App:**
   - Make sure Expo is running (`npx expo start`)
   - Scan QR code or press 'i' in terminal
   - App will open in simulator

4. **Take Screenshots:**
   - Navigate through your app
   - Press `Cmd + S` to take screenshot
   - Screenshots saved to Desktop

### **Option 2: Physical iPhone**

1. **Install TestFlight app** on your iPhone
2. **Install Dopamax** from TestFlight
3. **Take screenshots** using:
   - Power + Volume Up buttons
   - Or use AssistiveTouch

## 📸 **Screenshot Ideas:**

### **Screenshot 1: Main Screen with Tasks**
- Show the main interface with several tasks
- Include the progress bar showing completion
- Highlight the dopamine counter

### **Screenshot 2: Adding a New Task**
- Show the "Add New Task" section
- Display the input field with placeholder text
- Show the "Add Task" button

### **Screenshot 3: Completed Tasks View**
- Show tasks with checkmarks
- Display the progress bar at 75% completion
- Show the "Show Completed" toggle

### **Screenshot 4: Empty State**
- Show the motivational empty state
- Display the emoji and encouraging text
- Show the "Add your first task" message

### **Screenshot 5: Task Management**
- Show a task being completed
- Display the visual feedback
- Highlight the dopamine score increase

## 🎨 **Screenshot Tips:**

### **Design Guidelines:**
- **Clean background:** Make sure no personal data is visible
- **Good lighting:** Ensure text is readable
- **Consistent styling:** Use the same theme throughout
- **Show key features:** Highlight the main functionality

### **Technical Requirements:**
- **PNG format** (recommended)
- **No device frames** (Apple will add them)
- **High resolution** (at least 2x for retina displays)
- **No status bar** (simulator can hide this)

## 📱 **Simulator Commands:**

```bash
# List available simulators
xcrun simctl list devices

# Open specific simulator
xcrun simctl boot "iPhone 15 Pro Max"

# Take screenshot programmatically
xcrun simctl io booted screenshot ~/Desktop/screenshot.png
```

## 🖼️ **Screenshot Dimensions Reference:**

| Device | Width | Height | Aspect Ratio |
|--------|-------|--------|--------------|
| iPhone 15 Pro Max | 1290px | 2796px | 19.5:9 |
| iPhone 14 Plus | 1242px | 2688px | 19.5:9 |
| iPhone 8 Plus | 1242px | 2208px | 16:9 |
| iPad Pro 12.9" | 2048px | 2732px | 4:3 |

## ✅ **Checklist:**

- [ ] Take screenshots for iPhone 6.7" (1290 × 2796px)
- [ ] Take screenshots for iPhone 6.5" (1242 × 2688px)
- [ ] Take screenshots for iPhone 5.5" (1242 × 2208px)
- [ ] Take screenshots for iPad Pro 12.9" (2048 × 2732px)
- [ ] Ensure no personal data is visible
- [ ] Test all key features are shown
- [ ] Verify text is readable
- [ ] Save in PNG format

## 🚀 **Next Steps:**

1. **Take screenshots** using simulator or device
2. **Review screenshots** for quality and content
3. **Upload to App Store Connect** in the app metadata section
4. **Add descriptions** for each screenshot
5. **Submit for review**

## 📞 **Need Help?**

If you need assistance with taking screenshots:
- Use iOS Simulator for consistent results
- Test on different device sizes
- Ensure your app looks good on all screen sizes
