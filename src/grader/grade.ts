import * as fs from "fs";
import { execSync } from "child_process";
import * as path from "path";
import { Logger } from "@nestjs/common";

export enum Verdict {
    CORRECT = "CORRECT",
    PARTIAL = "PARTIAL",
    WRONG = "WRONG",
    ERROR = "ERROR",
    FAILED = "FAILED",
    PENDING = "PENDING" // Add PENDING status
}

type GradeResult = {
    verdict: Verdict;
    score: number;
    detail: string;
}

export function downloadTemplate(assignment: string) {
    Logger.log("Downloading template...");
    const TEMPLATE_DIR = path.resolve("./template/");
    if (fs.existsSync(TEMPLATE_DIR))
        fs.rmSync(TEMPLATE_DIR, { recursive: true, force: true });
    fs.mkdirSync(TEMPLATE_DIR, { recursive: true });
    try {
        execSync(`echo ` + assignment + ` | sbt new ku-plrg-classroom/${assignment}.g8`, { cwd: TEMPLATE_DIR });
    } catch (error) {
        Logger.error("Failed to download template: " + error.message);
        process.exit(1);
    }
}

export function grade(assignment: string, code: string): GradeResult {
    const TEMPLATE_DIR = path.resolve("./template/" + assignment);
    const IMPLEMENT_DIR = TEMPLATE_DIR + "/src/main/scala/kuplrg/Implementation.scala";
    fs.writeFileSync(IMPLEMENT_DIR, code);

    if (fs.existsSync(TEMPLATE_DIR + "/score"))
        fs.unlinkSync(TEMPLATE_DIR + "/score");

    let detail = "";
    try {
        execSync(`sbt test`, { cwd: TEMPLATE_DIR });
    } catch (error) {
        detail = error.stdout.toString();
    }

    let score = 0;
    let verdict: Verdict = Verdict.ERROR;
    try {
        score = Number(fs.readFileSync(TEMPLATE_DIR + "/score", "utf8"));
        detail = fs.readFileSync(TEMPLATE_DIR + "/test-detail", "utf8");
        if (score == 100)
            verdict = Verdict.CORRECT;
        else if (score > 0)
            verdict = Verdict.PARTIAL;
        else
            verdict = Verdict.WRONG;

    } catch (error) {
        Logger.error("Failed to read score or detail: " + error.message);
        verdict = Verdict.FAILED;
    }

    return {
        verdict: verdict,
        score: Number(score),
        detail: detail.toString(),
    };
}

