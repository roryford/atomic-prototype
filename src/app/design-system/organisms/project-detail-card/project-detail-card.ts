import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { Divider } from 'primeng/divider';
import { Project } from '../../../models';
import { DsFormField } from '../../molecules/form-field/form-field';
import { DsButton } from '../../atoms/button/button';
import { DsTag } from '../../atoms/tag/tag';
import { DsInput } from '../../atoms/input/input';

/**
 * Organism: Renders a single project's details as a card.
 *
 * Owns the raw PrimeNG primitives (Avatar, Divider) so pages can delegate
 * rendering instead of composing primitives directly. Display fields are
 * read-only since this is a detail (view) surface, not an edit form.
 */
@Component({
  selector: 'ds-project-detail-card',
  imports: [Avatar, Divider, DsFormField, DsButton, DsTag, DsInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-detail-card.html',
  styleUrl: './project-detail-card.scss',
})
export class DsProjectDetailCard {
  project = input.required<Project>();
  backClicked = output<void>();
}
