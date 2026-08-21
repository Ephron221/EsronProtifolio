const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@esron.io').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecure2026!';
    const adminName = process.env.ADMIN_NAME || 'Esron Admin';

    // Remove legacy typos if any
    await User.deleteOne({ email: 'esront21@gamil.com' });
    
    const userExists = await User.findOne({ email: adminEmail });
    
    if (userExists) {
      userExists.name = adminName;
      userExists.password = adminPassword;
      await userExists.save();
      console.log(`[Seed]: Admin user '${adminEmail}' credentials successfully updated.`);
    } else {
      const admin = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      await admin.save();
      console.log(`[Seed]: Admin user '${adminEmail}' successfully created.`);
    }

    console.log(`[Seed Summary]: Email: ${adminEmail} (Role: admin)`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]: Error seeding admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
