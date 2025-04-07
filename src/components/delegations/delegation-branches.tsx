"use client";
import BranchList from "@/components/branches/index";

interface DelegationBranchesProps {
	companyId: string;
	companyName: string;
	delegationId: string;
	delegationName: string;
}

export default function DelegationBranches({
	companyId,
	companyName,
	delegationId,
	delegationName,
}: DelegationBranchesProps) {
	return (
		<BranchList
			initialCompanyFilter={companyId}
			initialDelegationFilter={delegationId}
		/>
	);
}
