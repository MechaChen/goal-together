import { FormEvent, useEffect, useState } from "react";
import { FileAudio, Play, RotateCcw, Upload } from "lucide-react";

import { REWARD_AUDIO_SETTINGS_COPY } from "../../config/reward-audio-settings.config";
import type {
    RewardAudioSettings,
    RewardAudioSlot,
} from "../../services/reward-hierarchy.types";

export type RewardAudioSettingsModalProps = {
    isOpen: boolean;
    isLoading: boolean;
    settings: RewardAudioSettings | null;
    onClose: () => void;
    onPreviewSlot: (slot: RewardAudioSlot["kind"]) => void;
    onUploadSlot: (slot: RewardAudioSlot["kind"], file: File) => Promise<void>;
    onRemoveSlot: (slot: RewardAudioSlot["kind"]) => Promise<void>;
};

type RewardAudioSlotSectionProps = {
    slot: RewardAudioSlot;
    onPreviewSlot: (slot: RewardAudioSlot["kind"]) => void;
    onUploadSlot: (slot: RewardAudioSlot["kind"], file: File) => Promise<void>;
    onRemoveSlot: (slot: RewardAudioSlot["kind"]) => Promise<void>;
};

function formatFileSize(fileSizeBytes: number | null): string | null {
    if (fileSizeBytes === null) {
        return null;
    }
    return `${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`;
}

function FileSelectionRow({
    slot,
    selectedFile,
    onFileChange,
}: {
    slot: RewardAudioSlot;
    selectedFile: File | null;
    onFileChange: (file: File | null) => void;
}) {
    const inputId = `reward-audio-upload-${slot.kind}`;
    const selectedFileLabel =
        selectedFile?.name ?? slot.original_filename ?? null;
    const visibleFileLabel =
        selectedFileLabel ?? REWARD_AUDIO_SETTINGS_COPY.defaultStatus;

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <label
                    htmlFor={inputId}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-soft bg-surface-muted px-4 py-2 text-sm font-medium text-ink-strong"
                >
                    <FileAudio size={16} aria-hidden />
                    {REWARD_AUDIO_SETTINGS_COPY.chooseFileButton}
                </label>
                <span
                    className="min-w-0 flex-1 truncate whitespace-nowrap text-sm text-ink-soft"
                    title={visibleFileLabel}
                >
                    {visibleFileLabel}
                </span>
                <input
                    id={inputId}
                    className="sr-only"
                    type="file"
                    accept=".mp3,.wav,audio/mpeg,audio/wav"
                    onChange={(event) =>
                        onFileChange(event.target.files?.[0] ?? null)
                    }
                />
            </div>
        </div>
    );
}

function RewardAudioSlotSection({
    slot,
    onPreviewSlot,
    onUploadSlot,
    onRemoveSlot,
}: RewardAudioSlotSectionProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setSelectedFile(null);
    }, [slot.updated_at, slot.has_custom_audio]);

    async function submitSelectedAudio(event: FormEvent) {
        event.preventDefault();
        if (!selectedFile) {
            return;
        }
        setIsSaving(true);
        try {
            await onUploadSlot(slot.kind, selectedFile);
            setSelectedFile(null);
        } finally {
            setIsSaving(false);
        }
    }

    async function removeCustomAudio() {
        setIsSaving(true);
        try {
            await onRemoveSlot(slot.kind);
        } finally {
            setIsSaving(false);
        }
    }

    const fileSizeLabel = formatFileSize(slot.file_size_bytes);
    const statusLabel = slot.has_custom_audio
        ? `${slot.original_filename ?? "Custom audio"}${fileSizeLabel ? ` · ${fileSizeLabel}` : ""}`
        : REWARD_AUDIO_SETTINGS_COPY.defaultStatus;

    return (
        <section className="space-y-3 rounded-[24px] border border-soft bg-white p-4">
            <div className="space-y-1">
                <h3 className="text-sm font-semibold text-ink-strong">
                    {REWARD_AUDIO_SETTINGS_COPY.sectionTitle[slot.kind]}
                </h3>
                <p className="text-xs text-ink-soft">{statusLabel}</p>
            </div>
            <form
                className="space-y-3"
                onSubmit={(event) => void submitSelectedAudio(event)}
            >
                <FileSelectionRow
                    slot={slot}
                    selectedFile={selectedFile}
                    onFileChange={setSelectedFile}
                />
                <p className="text-xs text-ink-soft">
                    {REWARD_AUDIO_SETTINGS_COPY.fileHint}
                </p>
                <div className="flex flex-wrap gap-2">
                    <button
                        className="inline-flex items-center gap-2 rounded-full border border-muted bg-surface-muted px-4 py-2 text-sm font-medium text-ink-strong disabled:opacity-50"
                        type="button"
                        onClick={() => onPreviewSlot(slot.kind)}
                        disabled={isSaving}
                    >
                        <Play size={15} aria-hidden />
                        {REWARD_AUDIO_SETTINGS_COPY.previewButton}
                    </button>
                    <button
                        className="inline-flex items-center gap-2 rounded-full bg-accent-blue px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        type="submit"
                        disabled={!selectedFile || isSaving}
                    >
                        <Upload size={15} aria-hidden />
                        {REWARD_AUDIO_SETTINGS_COPY.uploadButton}
                    </button>
                    {slot.has_custom_audio ? (
                        <button
                            className="inline-flex items-center gap-2 rounded-full border border-danger bg-danger-bg px-4 py-2 text-sm font-medium text-danger-text disabled:opacity-50"
                            type="button"
                            onClick={() => void removeCustomAudio()}
                            disabled={isSaving}
                        >
                            <RotateCcw size={15} aria-hidden />
                            {REWARD_AUDIO_SETTINGS_COPY.resetButton}
                        </button>
                    ) : null}
                </div>
            </form>
        </section>
    );
}

export function RewardAudioSettingsModal({
    isOpen,
    isLoading,
    settings,
    onClose,
    onPreviewSlot,
    onUploadSlot,
    onRemoveSlot,
}: RewardAudioSettingsModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Reward audio settings"
        >
            <div className="w-full max-w-xl rounded-[28px] border border-panel bg-surface-card p-5 shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-ink-strong">
                            {REWARD_AUDIO_SETTINGS_COPY.title}
                        </h2>
                        <p className="text-sm text-ink-soft">
                            {REWARD_AUDIO_SETTINGS_COPY.description}
                        </p>
                    </div>
                    <button
                        className="rounded-full border border-muted bg-surface-muted px-3 py-1 text-sm font-medium text-ink-strong"
                        type="button"
                        onClick={onClose}
                    >
                        {REWARD_AUDIO_SETTINGS_COPY.closeButton}
                    </button>
                </div>
                {isLoading || !settings ? (
                    <p className="text-sm text-ink-soft">
                        Loading reward audio settings...
                    </p>
                ) : (
                    <div className="space-y-3">
                        {settings.slots.map((slot) => (
                            <RewardAudioSlotSection
                                key={slot.kind}
                                slot={slot}
                                onPreviewSlot={onPreviewSlot}
                                onUploadSlot={onUploadSlot}
                                onRemoveSlot={onRemoveSlot}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
