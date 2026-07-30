import { Directive, directive, PartType } from 'lit/directive.js';

import type { ElementPart, PartInfo } from 'lit/directive.js';

class ForwardPropsDirective extends Directive {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(_props: Record<string, unknown>): void {}

    override update(part: PartInfo, [props]: [Record<string, unknown>]): void {
        if (part.type !== PartType.ELEMENT) return;
        const { element } = part as ElementPart;
        const target = element as HTMLElement & { [key: string]: unknown };
        for (const [key, value] of Object.entries(props)) target[key] = value;
    }
}

export const forwardProps = directive(ForwardPropsDirective);
