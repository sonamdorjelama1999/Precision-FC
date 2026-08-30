"use client";

import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DeleteDialog, EmptyState, useDeleteFlow } from "@/components/admin/admin-table-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteSponsor, deleteStaffMember } from "@/features/team/actions";
import { initials } from "@/lib/format";
import { SPONSOR_TIER_LABEL, type Sponsor, type StaffMember } from "@/types";

export function StaffTable({ staff }: { staff: StaffMember[] }) {
  const { target, setTarget, isPending, confirm } = useDeleteFlow(deleteStaffMember);

  if (staff.length === 0) {
    return (
      <EmptyState
        title="No staff yet"
        body="Add the manager and they appear alongside the squad on the public site."
        href="/admin/staff/new"
        cta="Add staff member"
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden w-20 md:table-cell">Order</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="pfc-player-ground relative grid size-11 place-items-center overflow-hidden rounded-md">
                    {member.photoUrl ? (
                      <Image src={member.photoUrl} alt="" fill sizes="44px" className="object-cover object-top" />
                    ) : (
                      <span className="font-display text-xs font-black text-white/50">
                        {initials(member.name)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell className="text-muted-foreground">{member.role}</TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                  {member.displayOrder}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" aria-label={`Edit ${member.name}`}>
                      <Link href={`/admin/staff/${member.id}/edit`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${member.name}`}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setTarget({ id: member.id, name: member.name })}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteDialog
        target={target}
        onOpenChange={(open) => !open && setTarget(null)}
        onConfirm={confirm}
        isPending={isPending}
        noun="staff member"
      />
    </>
  );
}

export function SponsorTable({ sponsors }: { sponsors: Sponsor[] }) {
  const { target, setTarget, isPending, confirm } = useDeleteFlow(deleteSponsor);

  if (sponsors.length === 0) {
    return (
      <EmptyState
        title="No sponsors yet"
        body="Add one and the sponsor band appears on the home and squad pages."
        href="/admin/sponsors/new"
        cta="Add sponsor"
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="hidden md:table-cell">Website</TableHead>
              <TableHead className="hidden w-20 md:table-cell">Order</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sponsors.map((sponsor) => (
              <TableRow key={sponsor.id}>
                <TableCell>
                  <div className="grid h-11 w-24 place-items-center overflow-hidden rounded-md border border-border bg-background p-1.5">
                    {sponsor.logoUrl ? (
                      <Image
                        src={sponsor.logoUrl}
                        alt=""
                        width={96}
                        height={44}
                        className="max-h-9 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-muted-foreground">No logo</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{sponsor.name}</TableCell>
                <TableCell>
                  <Badge variant={sponsor.tier === "PRINCIPAL" ? "lime" : "outline"}>
                    {SPONSOR_TIER_LABEL[sponsor.tier]}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {sponsor.websiteUrl ? (
                    <a
                      href={sponsor.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-teal-dark hover:underline"
                    >
                      {sponsor.websiteUrl.replace(/^https?:\/\//, "")}
                      <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                  {sponsor.displayOrder}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" aria-label={`Edit ${sponsor.name}`}>
                      <Link href={`/admin/sponsors/${sponsor.id}/edit`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${sponsor.name}`}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setTarget({ id: sponsor.id, name: sponsor.name })}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteDialog
        target={target}
        onOpenChange={(open) => !open && setTarget(null)}
        onConfirm={confirm}
        isPending={isPending}
        noun="sponsor"
      />
    </>
  );
}
