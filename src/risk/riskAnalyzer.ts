
import type { RegistryResult } from "../registry/types";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type RiskResult = {
  name: string;
  score: number;
  level: RiskLevel;
  reasons: string[];
};

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

export function analyzeRisk(packageInfo: RegistryResult): RiskResult {
  if (!packageInfo.exists) {
    return {
      name: packageInfo.name,
      score: 100,
      level: "CRITICAL",
      reasons: ["Package does not exist on npm"],
    };
  }

  let score = 0;
  const reasons: string[] = [];

  if (packageInfo.createdAt) {
    const createdAt = new Date(packageInfo.createdAt);

    // Ignore invalid timestamps instead of calculating with NaN.
    if (!Number.isNaN(createdAt.getTime())) {
      const ageInDays =
        (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

      if (ageInDays >= 0 && ageInDays < 7) {
        score += 30;
        reasons.push("Package is less than 7 days old");
      }
    }
  }

  if (
    packageInfo.downloads !== null &&
    packageInfo.downloads < 100
  ) {
    score += 20;
    reasons.push("Package has a very low download activity");
  }

  if (!packageInfo.repository) {
    score += 15;
    reasons.push("No repository found");
  }

  const lifecycleScripts = [
    "preinstall",
    "install",
    "postinstall",
    "prepare",
  ];

  const hasLifecycleScript = lifecycleScripts.some(
    (script) => Boolean(packageInfo.scripts?.[script])
  );

  if (hasLifecycleScript) {
    score += 20;
    reasons.push("Package contains install-time lifecycle scripts");
  }

  const finalScore = Math.min(score, 100);

  return {
    name: packageInfo.name,
    score: finalScore,
    level: getRiskLevel(finalScore),
    reasons,
  };
}
