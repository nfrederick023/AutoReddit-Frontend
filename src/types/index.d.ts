// export const useCheckbox = <P>(config: CheckboxConfig<P> | Record<string, never>): [Checkbox<P>] => {
//     function setCheckbox(this: Checkbox<P>, config: Checkbox<P>)
//     function setOptions(this: Checkbox<P>, options: CheckboxConfig<P>[])
//     function addOption(this: Checkbox<P>, option: CheckboxConfig<P>)
//     function setIsSelected(this: Checkbox<P>, isSelected: boolean): void
//     function setProperties(this: Checkbox<P>, properties: P): void 
//     function setName(this: Checkbox<P>, name: string): void 
//     function getSelectedOptions(this: Checkbox<P>): Checkbox<P>[] 
//     function isIndeterminate(this: Checkbox<P>): boolean 
//     function isAllSelected(this: Checkbox<P>): boolean 
//     function isAnySelected(this: Checkbox<P>): boolean 
//     function removeOption(this: Checkbox<P>): void 
//     function select(this: Checkbox<P>): void 

    
//     const [state, setState] = useState(createCheckbox(config, undefined));
//     return [state];
// };
