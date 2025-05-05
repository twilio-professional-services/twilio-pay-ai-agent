import mockData from "../../../data/mock-data";
import moment from "moment";
import logger from "../../../utils/logger";

export interface VerifyUserParams {
  firstName: string;
  lastName: string;
  DOB: string;
}

export async function verifyUser(params: VerifyUserParams): Promise<string> {
  logger.info("Verify user params", { params });

  for (const user of mockData.users) {
    const userDOB = moment(user.dob, ["YYYY-MM-DD", "MM/DD/YYYY"], true);
    const paramDOB = moment(params.DOB, ["YYYY-MM-DD", "MM/DD/YYYY"], true);

    if (!userDOB.isValid() || !paramDOB.isValid()) {
      logger.error("Invalid date format for user or params", {
        userDOB,
        paramDOB,
      });
      continue;
    }

    if (
      user.firstName === params.firstName &&
      user.lastName === params.lastName &&
      userDOB.isSame(paramDOB, "day")
    ) {
      return JSON.stringify({
        userId: user.userId,
        verified: true,
      });
    }
  }

  return JSON.stringify({
    userId: null,
    verified: false,
  });
}
