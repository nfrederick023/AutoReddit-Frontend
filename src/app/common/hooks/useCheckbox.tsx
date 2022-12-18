
import { Dispatch, SetStateAction, useState } from 'react';

/**
 * A hook for checkboxes with select all. 
 * @param initialState the intial check state of the checkboxes
 * @returns a utility class containing the necassary functions needed for useCheckbox 
 */
export const useCheckbox = (initialState: boolean[][]): [CheckBoxUtility] => {
   const [state, setState] = useState<boolean[][]>(initialState);

   return [new CheckBoxUtility(state, setState)];
};

/**
 *  Class which contains the necassary functions needed for useCheckbox 
 */
class CheckBoxUtility {
   public checkedState: boolean[][];
   public setState: Dispatch<SetStateAction<boolean[][]>>;

   public constructor(checkedState: boolean[][], setState: Dispatch<SetStateAction<boolean[][]>>) {
      this.checkedState = [...checkedState];
      this.setState = setState;
   }

   /**
    * Checks or unchecks all the boxes based on the check state of the parent checkbox. 
    * 
    * @param parent is the parent checkbox
    */
   public checkAll = (parent: number): void => {
      if (this.isIndeterminate(parent))
         this.checkedState[parent] = this.checkedState[parent].map(() => true);
      else
         this.checkedState[parent] = this.checkedState[parent].map(() => !this.checkedState[parent][0]);

      this.setState(this.checkedState);
   };

   /**
    * Checks a single child checkbox.
    * 
    * @param parent is the parent checkbox
    * @param child  is the child checkbox 
    */
   public checkOne = (parent: number, child: number): void => {
      this.checkedState[parent][child] = !this.checkedState[parent][child];
      this.setState(this.checkedState);
   };

   /**
    * Determines if a single child checkbox is checked.
    * 
    * @param parent is the parent checkbox
    * @param child  is the child checkbox
    * @returns the check state of the child checkbox
    */
   public isChecked = (parent: number, child: number): boolean => {
      if (!this.checkedState?.[parent]) {
         this.checkedState[parent] = [];
         this.setState(this.checkedState);
      }
      if (typeof this.checkedState?.[parent]?.[child] !== 'boolean') {
         this.checkedState[parent][child] = false;
         this.setState(this.checkedState);
      }

      return !!this.checkedState[parent]?.[child];
   };

   /**
    * Determines if the parent checkbox state is indeterminate.
    * 
    * @param parent is the parent checkbox
    * @returns true if the parent checkbox state is indeterminate
    */
   public isIndeterminate = (parent: number): boolean => {
      if (this.isAllChecked(parent))
         return false;
      return !!this.checkedState[parent]?.some(checked => checked);
   };

   /**
    * Determines if the childern checkboxs within a parent checkboxes are all checked.
    * 
    * @param parent is the parent checkbox
    * @returns true if the childern check boxes within the parent checkbox are all checked
    */
   public isAllChecked = (parent: number): boolean => {
      return this.checkedState[parent]?.filter(checked => checked).length === this.checkedState[parent]?.length;
   };

   /**
    * Determines if any of the childern checkboxs within a parent checkboxes are checked.
    * 
    * @param parent is the parent checkbox
    * @returns true if any of the childern check boxes within the parent checkbox are checked
    */
   public isAnyChecked = (parent: number): boolean => {
      return this.isIndeterminate(parent) || this.isAllChecked(parent);
   };
}

