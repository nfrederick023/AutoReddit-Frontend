/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable func-style */
import { Checkbox, CheckboxConfig } from 'index';
import { Dispatch, SetStateAction, useState } from 'react';

export const useCheckbox = <P>(config: CheckboxConfig<P> | Record<string, never>): [Checkbox<P>] => {

    function updateRefs(config: Checkbox<P>, oldCB: Checkbox<P>): Checkbox<P> {
        //@ts-ignore
        config = { ...config, isSelected: config.isAllSelected() };
        if (config.ref) {
            const options = [...config.ref.options];
            options[config.ref.options.findIndex(option => option === oldCB)] = createCheckbox(config, config.ref);
            const updatedConfig = { ...config.ref, options } as Checkbox<P>;
            return updateRefs(updatedConfig, config.ref);
        }
        return createCheckbox(config, undefined);
    }

    function setCheckbox(this: Checkbox<P>, config: Checkbox<P>): void {
        //@ts-ignore
        if (config.isAllSelected)
            setState(updateRefs(config, this));
        else
            setState(createCheckbox(config, undefined));
    }

    function setOptions(this: Checkbox<P>, options: CheckboxConfig<P>[]): void {
        this.setCheckbox({ ...this, options });
    }

    function addOption(this: Checkbox<P>, option: CheckboxConfig<P>): void {
        this.setOptions([...this.options, option]);
    }

    function setIsSelected(this: Checkbox<P>, isSelected: boolean): void {
        function selectOne(cb: Checkbox<P>, isSelected: boolean): CheckboxConfig<P> {
            const options = cb.options.map(option => { return { ...selectOne(option, isSelected), isSelected }; });
            return { ...cb, options, isSelected };
        }

        const options = this.options.map(option => { return selectOne(option, isSelected); });
        this.setCheckbox({ ...this, options, isSelected });
    }

    function setProperties(this: Checkbox<P>, properties: P): void {
        this.setCheckbox({ ...this, properties });
    }

    function setName(this: Checkbox<P>, name: string): void {
        this.setCheckbox({ ...this, name });
    }

    function getSelectedOptions(this: Checkbox<P>): Checkbox<P>[] {
        return this.options.filter(option => option.isSelected);
    }

    function isIndeterminate(this: Checkbox<P>): boolean {
        if (this.isAllSelected())
            return false;
        return this.options.some(item => item.isSelected);
    }

    function isAllSelected(this: Checkbox<P>): boolean {
        if (this.options.length)
            return !this.options.filter(option => !option.isSelected).length;
        return this.isSelected;
    }

    function isAnySelected(this: Checkbox<P>): boolean {
        return this.isIndeterminate() || this.isAllSelected();
    }

    function removeOption(this: Checkbox<P>): void {
        const options = this.ref?.options.filter(option => option !== this);
        if (this.ref)
            this.ref.setCheckbox({ ...this.ref, options });
    }

    function select(this: Checkbox<P>): void {
        if (this.isIndeterminate())
            this.setIsSelected(true);
        else
            this.setIsSelected(!this.isSelected);
    }

    function createCheckbox(config: CheckboxConfig<P> | Record<string, never>, ref: Checkbox<P> | undefined): Checkbox<P> {
        const cb: Checkbox<P> = {
            getSelectedOptions, isIndeterminate, isAllSelected, isAnySelected, setIsSelected,
            setProperties, removeOption, setCheckbox, setOptions, addOption, setName, select,
            isSelected: config.isSelected ?? false,
            properties: config.properties ?? {},
            name: config.name,
            options: [],
            ref
        };

        config.options?.forEach(option => cb.options.push(createCheckbox(option, cb)));
        return cb;
    }

    const [state, setState] = useState<Checkbox<P>>(createCheckbox(config, undefined));
    return [state];
};
