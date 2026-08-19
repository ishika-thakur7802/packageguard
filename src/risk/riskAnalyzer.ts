import type { RegistryResult } from "../registry/types";
// export type RegistryResult = {
//   name: string;
//   exists: boolean;
//   latestVersion?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   repository?: string;
//   downloads?: number;
//   installScripts?: string[];
// };

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type RiskResult = {
  name: string;
  score: number;
  level: RiskLevel;
  reasons: string[];
};

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) {
    return "CRITICAL";
  }

  if (score >= 60) {
    return "HIGH";
  }

  if (score >= 30) {
    return "MEDIUM";
  }

  return "LOW";
}

export function analyzeRisk(packageInfo: RegistryResult): RiskResult {
  if (!packageInfo.exists) {
    return {
      name: packageInfo.name,
      score: 100,
      level: "CRITICAL",
      reasons: [
        "Package does not exist on npm"
      ]
    };
  }

   let score = 0;
   const reasons: string[] = [];

   if (packageInfo.createdAt) {
     const createdAt = new Date(packageInfo.createdAt);
     const now = new Date();

     const ageInDays =
       (now.getTime() - createdAt.getTime()) /
       (1000 * 60 * 60 * 24);

     if (ageInDays < 7) {
       score += 30;

       reasons.push(
         "Package is less than 7 days old"
       );
     }
   }

   if(packageInfo.downloads!==undefined && packageInfo.downloads<100)
   {
       score+=20;
       reasons.push(
           "Package has a very low download activity"
           )
       }
   if(!packageInfo.repository)
   {
       score+=15;
       reasons.push(
           "No repository found");
       }
if (
  packageInfo.installScripts &&
  packageInfo.installScripts.length > 0
) {
  score += 20;

  reasons.push(
    "Package contains install-time scripts"
  );
}

const finalScore = Math.min(score, 100);
const level = getRiskLevel(finalScore);

 return {
     name: packageInfo.name,
     score: finalScore,
     level,
     reasons
   };
}
