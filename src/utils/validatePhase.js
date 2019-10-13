import isNilOrEmpty from './isNilOrEmpty';

export default (phase = {}, classroom = {}) => {
    switch(phase.number) {
        case 1:
            return [
                ...isNilOrEmpty(classroom.branchRepresentativeName) ? ['jméno zástupce pobočky'] : [],
                ...isNilOrEmpty(classroom.branchRepresentativeEmail) ? ['e-mail zástupce pobočky'] : [],
                ...isNilOrEmpty(classroom.branchRepresentativePhone) ? ['telefon zástupce pobočky'] : [],
                ...isNilOrEmpty(classroom.branchAddress) ? ['adresa pobočky'] : [],
                ...isNilOrEmpty(classroom.schoolMeeting) ? ['schůzka ve škole'] : [],
                ...isNilOrEmpty(classroom.schoolAddress) ? ['adresa školy'] : [],
                ...isNilOrEmpty(classroom.directorName) ? ['jméno zástupce školy'] : [],
                ...isNilOrEmpty(classroom.directorEmail) ? ['e-mail zástupce školy'] : [],
                ...isNilOrEmpty(classroom.directorPhone) ? ['telefon zástupce školy'] : [],
            ];
        case 2:
            return [
                ...isNilOrEmpty(classroom.classroomName) ? ['jméno třídy'] : [],
                ...isNilOrEmpty(classroom.teacherName) ? ['jméno učitele'] : [],
                ...isNilOrEmpty(classroom.teacherEmail) ? ['e-mail učitele'] : [],
                ...isNilOrEmpty(classroom.teacherPhone) ? ['telefon učitele'] : [],
                ...isNilOrEmpty(classroom.childrenCount) ? ['počet dětí ve třídě'] : [],
                ...isNilOrEmpty(classroom.excursionDate) ? ['datum exkurze'] : [],
                ...isNilOrEmpty(classroom.toolboxOrder) ? ['objednávka toolboxu'] : [],
            ];
        case 3:
            return [];
        case 4:
            return [
                ...isNilOrEmpty(classroom.fairDate) ? ['datum jarmarku'] : [],
                ...isNilOrEmpty(classroom.fairTime) ? ['začátek jarmarku'] : [],
                ...isNilOrEmpty(classroom.fairEnd) ? ['konec jarmarku'] : [],
                ...isNilOrEmpty(classroom.kioskReadyTime) ? ['kdy mají být stánky připraveny'] : [],
                ...isNilOrEmpty(classroom.kioskPlace) ? ['prostor pro stánky'] : [],
            ];
        case 5:
            return [
                ...isNilOrEmpty(classroom.companyName) ? ['název firmy'] : [],
                ...isNilOrEmpty(classroom.businessPurpose) ? ['v čem děti podnikají'] : [],
                ...isNilOrEmpty(classroom.businessDescription) ? ['výdělek - použití'] : [],
            ];
        case 6:
            return [];
        case 7:
            return [
                ...isNilOrEmpty(classroom.moneyGoalAmount) ? ['částka výdělku'] : [],
            ];
        case 8:
            return [];
        default: return [];
    }
};
