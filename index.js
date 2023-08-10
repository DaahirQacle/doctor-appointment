import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import hospitalRoutes from "./Routes/hostipalRoute.js";
import departmentRoutes from "./Routes/departmentRoute.js";
import patientRoutes from "./Routes/patientRoute.js";
import doctorsRoute from "./Routes/doctorsRoute.js";
import register from "./Routes/registerRoute.js";
import admin_route from "./Routes/admin_routes.js";
import appointment_route from "./Routes/appointment_route.js";
import bodyParser from 'body-parser';
import emergency_route from "./Routes/emergency_route.js";
import dashboard_route from "./Routes/dashboard_route.js";
import user_route from "./Routes/user_routes.js";
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
// app.use(bodyParser.json({ limit: '100mb' }));
// app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
const connectedDB = async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log("connected successfully");
  } catch (error) {
    console.log(error);
  }
};

connectedDB();


app.use("/api/v1", hospitalRoutes);
app.use("/api/v1", departmentRoutes);
app.use("/api/v1", patientRoutes);
app.use("/api/v1", register);
app.use("/api/v1", doctorsRoute);
 app.use("/api/v1",appointment_route)
 app.use("/api/v1",admin_route)
 app.use("/api/v1",emergency_route)
 app.use("/api/v1",dashboard_route)
 app.use('/api/v1',user_route)


// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

app.set('port', process.env.PORT || 3000);

app.server = app.listen(app.get('port'), () => {
  console.log(`Server started on port ${app.get('port')}`);
});

app.server.maxHeadersCount = 1000;
app.server.maxPayload = 100 * 1024 * 1024; // set maxPayload to 100MB
