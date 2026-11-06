-- Allow gait clips on the pet record. Video bytes stay on the phone.
-- The row stores the note, the date, and the file name.

alter table public.pet_vault_entries drop constraint if exists pet_vault_entries_kind_check;

alter table public.pet_vault_entries
  add constraint pet_vault_entries_kind_check
  check (kind in ('vet_record', 'vaccination', 'daily_note', 'gait_clip'));
