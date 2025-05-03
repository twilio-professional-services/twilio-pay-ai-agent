const mockData = {
  users: [
    {
      firstName: "John",
      lastName: "Doe",
      userId: "user123",
      dob: "1990-05-01",
      hsaAccount: {
        balance: 1200,
        lastContribution: "2024-09-01",
      },
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      userId: "user456",
      dob: "1985-05-15",
      hsaAccount: {
        balance: 800,
        lastContribution: "2024-08-01",
      },
    },
    {
      firstName: "Alice",
      lastName: "Johnson",
      userId: "user789",
      dob: "1992-07-20",
      hsaAccount: undefined,
    },
  ],

  bills: [
    {
      userId: "user123",
      visit: {
        date: "2024-10-01",
        hospital: "GHI Hospital",
      },
      bill: {
        copay: 150,
        total: 750,
        balance_due: 600,
        reason_for_balance: "Deductible not met",
        insurance: {
          provider: "Aetna",
          plan: "Gold",
          deductible: 1000,
          deductible_met: false,
        },
      },
    },
    {
      userId: "user456",
      visit: {
        date: "2024-11-15",
        hospital: "DEF Hospital",
      },
      bill: {
        copay: 100,
        total: 700,
        balance_due: 600,
        reason_for_balance: "Deductible not met",
        insurance: {
          provider: "UnitedHealthcare",
          plan: "Platinum",
          deductible: 800,
          deductible_met: false,
        },
      },
    },
    {
      userId: "user789",
      visit: {
        date: "2024-12-20",
        hospital: "GHI Hospital",
      },
      bill: {
        copay: 200,
        total: 850,
        balance_due: 650,
        reason_for_balance: "Deductible not met",
        insurance: {
          provider: "Cigna",
          plan: "Bronze",
          deductible: 1000,
          deductible_met: false,
        },
      },
    },
  ],

};

export default mockData;
