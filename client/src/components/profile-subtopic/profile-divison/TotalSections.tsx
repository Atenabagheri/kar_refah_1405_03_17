import type { HeadquarterSectionsType } from "../../../types/types"

interface PropsType {
    total: HeadquarterSectionsType;
}

const TotalSections = ({ total }: PropsType) => {
    return (
        <div className="min-w-[1200px] w-full bg-primary/20 flex gap-0 items-center">
            <div className="w-[5%] text-center text-sm whitespace-nowrap !p-2">جمع کل</div>
            <div className="w-[20%] !p-2"></div>
            <div className="w-[15%] text-center text-sm whitespace-nowrap !p-2">
                {total?.sectionCenter + total?.sectionGeneral + total?.sectionOffice + total?.sectionManagement}
            </div>
            <div className="w-[10%] text-center text-sm whitespace-nowrap !p-2">
                {total?.sectionDeputy}
            </div>
            <div className="w-[10%] text-center text-sm whitespace-nowrap !p-2">
                {total?.sectionCenter}
            </div>
            <div className="w-[10%] text-center text-sm whitespace-nowrap !p-2">
                {total?.sectionGeneral}
            </div>
            <div className="w-[10%] text-center text-sm whitespace-nowrap !p-2">
                {total?.sectionOffice}
            </div>
            <div className="w-[10%] text-center text-sm whitespace-nowrap !p-2">
                {total?.sectionManagement}
            </div>
            <div className="w-[10%] text-center text-sm whitespace-nowrap !p-2">
                {total?.sectionDepartment}
            </div>
        </div>
    )
}

export default TotalSections