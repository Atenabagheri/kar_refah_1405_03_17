const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");

const authRoutes = require("./auth/routes/authRoutes");
const settingsRoutes = require("./settings/routes/settingsRoute");
const provinceRoutes = require("./general/routes/provinceRoutes");
const countyRoutes = require("./general/routes/countyRoutes");
const cityRoutes = require("./general/routes/cityRoutes");
const siteRoutes = require("./general/routes/siteRoutes");
const divisionRoutes = require("./general/routes/divisionRoutes");
const sectionRoutes = require("./general/routes/sectionRoutes");
const unitPositionRoutes = require("./administrative/routes/unitPositionRoutes");
const countyPositionRoutes = require("./administrative/routes/countyPositionRoutes");
const sectionHeadquarterRoutes = require("./administrative/routes/sectionHeadquarterRoutes");
const organizationRoutes = require("./administrative/routes/organizationRoutes");
const employeeRoutes = require("./general/routes/employeeRoutes");
const positionRoutes = require("./general/routes/positionRoutes");
const assetCategoryRoutes = require("./general/routes/assetCategoryRoutes");
const assetRoutes = require("./general/routes/assetRoutes");
const buildingRoutes = require("./general/routes/buildingRoutes");
const floorRoutes = require("./general/routes/floorRoutes");
const roomRoutes = require("./general/routes/roomRoutes");
const dateCategoryRoutes = require("./administrative/routes/dateCategoryRoutes");
const electricityMeterRoutes = require("./energy/routes/electricityMeterRoutes");
const electricityBillRoutes = require("./energy/routes/electricityBillRoutes");
const waterMeterRoutes = require("./support/routes/waterMeterRoutes");
const waterBillRoutes = require("./support/routes/waterBillRoutes");
const gasMeterRoutes = require("./support/routes/gasMeterRoutes");
const gasBillRoutes = require("./support/routes/gasBillRoutes");
const greenMeterRoutes = require("./support/routes/greenMeterRoutes");
const greenBillRoutes = require("./support/routes/greenBillRoutes");
const dieselRoutes = require("./support/routes/dieselRoutes");
const maintenanceRoutes = require("./support/routes/maintenanceRoutes");
const insuranceRoutes = require("./support/routes/insuranceRoutes");
const vehicleRoutes = require("./support/routes/vehicleRoutes");
const vehicleBrandRoutes = require("./support/routes/vehicleBrandRoutes");
const vehicleTypeRoutes = require("./support/routes/vehicleTypeRoutes");
const logAuthRoutes = require("./log/routes/logAuthRoutes");
const dashboardRoutes = require("./dashboard/routes/dashboardRoutes");
const profileMaterialsRoutes = require("./modules/materials/profile/profileRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const normalizeNumbersMiddleware = require("./middleware/normalizeNumbersMiddleware");
const { morganFormat } = require("./utils/morganConfig");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET_KEY));

app.use(morgan(morganFormat));

app.use(normalizeNumbersMiddleware);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/province", provinceRoutes);
app.use("/api/county", countyRoutes);
app.use("/api/city", cityRoutes);
app.use("/api/site", siteRoutes);
app.use("/api/division", divisionRoutes);
app.use("/api/section", sectionRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/position", positionRoutes);
app.use("/api/asset-category", assetCategoryRoutes);
app.use("/api/asset", assetRoutes);
app.use("/api/building", buildingRoutes);
app.use("/api/floor", floorRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/date-category", dateCategoryRoutes);
app.use("/api/unit-position", unitPositionRoutes);
app.use("/api/county-position", countyPositionRoutes);
app.use("/api/section-headquarter", sectionHeadquarterRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/electricity-meter", electricityMeterRoutes);
app.use("/api/electricity-bill", electricityBillRoutes);
app.use("/api/water-meter", waterMeterRoutes);
app.use("/api/water-bill", waterBillRoutes);
app.use("/api/gas-meter", gasMeterRoutes);
app.use("/api/gas-bill", gasBillRoutes);
app.use("/api/green-meter", greenMeterRoutes);
app.use("/api/green-bill", greenBillRoutes);
app.use("/api/diesel", dieselRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/vehicle-brand", vehicleBrandRoutes);
app.use("/api/vehicle-type", vehicleTypeRoutes);
app.use("/api/log-auth", logAuthRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/materials/profile", profileMaterialsRoutes);

app.use(errorHandler);

module.exports = app;
