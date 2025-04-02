import { Citizenship, Creator, Gender, MemberOf, Occupation, Skill } from "./enums";

export interface Hero {
  nameLabel: string;
  genderLabel: Gender;
  citizenshipLabel: Citizenship;
  skillsLabel: Skill[];
  occupationLabel: Occupation;
  memberOfLabel: MemberOf;
  creatorLabel: Creator;
}