import mockData from "../../../data/mock-data";
import moment from "moment";

export interface VerifyUserParams {
  firstName: string;
  lastName: string;
  DOB: string;
}

export async function verifyUser(params: VerifyUserParams): Promise<string> {

  console.log('Verify User Params', params);

  for (const user of mockData.users) {

    const userDOB = moment(user.dob, ["YYYY-MM-DD", "MM/DD/YYYY"], true);
    const paramDOB = moment(params.DOB, ["YYYY-MM-DD", "MM/DD/YYYY"], true);

    if (!userDOB.isValid() || !paramDOB.isValid()) {
      console.error("Invalid date format for user or params");
      continue;
    }

    if (
      user.firstName === params.firstName &&
      user.lastName === params.lastName &&
      userDOB.isSame(paramDOB, "day")
    ) {
      return JSON.stringify({
        userId: user.userId,
        verified: true
      });
    }
  }

  return JSON.stringify({
    userId: null,
    verified: false
  });
}


