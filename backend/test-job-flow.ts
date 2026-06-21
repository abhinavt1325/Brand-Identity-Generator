import 'dotenv/config';

import { jobStore } from './src/store/postgres.store';
import { JobService } from './src/services/job.service';
import { v4 as uuidv4 } from 'uuid';

async function run() {
  console.log("Initializing test job flow...");
  const jobId = uuidv4();
  const input = {
    startupName: "TestStartup",
    industry: "Specialty Coffee",
    valueProp: "Space-roasted specialty coffee beans."
  };

  try {
    console.log("Creating job in store...");
    const job = await jobStore.createJob(jobId, input, null);
    console.log("Job created with ID:", job.jobId);

    console.log("Starting job execution...");
    await JobService.startJob(jobId, input);
    console.log("Job execution finished!");

    const finalJob = await jobStore.getJob(jobId);
    console.log("Final Job status:", finalJob?.status);
    console.log("Final Job error:", finalJob?.error);
  } catch (e) {
    console.error("FLOW ERROR:", e);
  }
  process.exit(0);
}

run();
