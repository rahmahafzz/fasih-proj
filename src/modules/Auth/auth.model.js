import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  id: { type: String, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['admin', 'vendor', 'learner'],
    default: 'learner'
  },
  mobileNumber: { type: String },
  country: { type: String },
  dateOfBirth: { type: Date },
   profile: {
    avatar: {
      type: String,
      default: null, 
      validate: {
        validator: function(value) {
          if (!value) return true; // Allow null/empty
          // Basic URL validation
          const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
          return urlRegex.test(value);
        },
        message: 'Avatar must be a valid image URL (jpg, jpeg, png, gif, webp)'
      }
    }
  // avatar: {
  //   public_id: {
  //     type: String,
  //     default: ''
  //   },
  //   url: {
  //     type: String,
  //     default: ''
  //   }
  // },
    },bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  preferences: {
    language: {
      type: String,
      enum: ['arabic', 'english'],
      default: 'arabic',
    },
    accessibility: {
      hearingQuestions: { type: Boolean, default: false },      // أسئلة السمع
      readingQuestions: { type: Boolean, default: true },      // أسئلة القراءة
      writingQuestions: { type: Boolean, default: true },      // أسئلة الكتابة
      speakingQuestions: { type: Boolean, default: true },     // أسئلة التحدث
      soundEffects: { type: Boolean, default: false },          // المؤثرات الصوتية
      hapticFeedback: { type: Boolean, default: false },        // الحث اللمسي
  },
    darkMode: {
      type: Boolean,
      default: false,
    },
   notificationsEnabled: {
    type: Boolean,
    default: true
  },
  rememberMe: { type: Boolean, default: false },
  }

}, { timestamps: true });

userSchema.virtual('avatarUrl').get(function() {
  if (this.profile.avatar) {
    return this.profile.avatar; // Return the actual URL
  }
  return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.name) + '&background=0d8abc&color=fff&size=200'; // Generate default avatar
});

// Include virtuals when converting to JSON
userSchema.set('toJSON', { virtuals: true });



export const UserModel = mongoose.model('User', userSchema);