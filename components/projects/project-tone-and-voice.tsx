import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import { Project } from "@/lib/database/models/project";
import { useUpdateProject } from "@/hooks/projects/use-update-project";

export const ProjectToneAndVoice = ({ project }: { project: Project }) => {
  const { mutateAsync: updateProject } = useUpdateProject();
  const [toneAndVoice, setToneAndVoice] = useState<{
    temperature: number;
    tone: number;
    treatment: number;
    style: number;
  }>({
    temperature: project.toneAndVoice?.temperature || 0,
    tone: project.toneAndVoice?.tone || 0,
    treatment: project.toneAndVoice?.treatment || 0,
    style: project.toneAndVoice?.style || 0,
  });

  const handleSave = () => {
    updateProject({
      projectId: project._id,
      project: {
        ...project,
        toneAndVoice,
      },
    });
    console.log("Tone & Voice for project", project._id, toneAndVoice);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Configurar tom e voz do projeto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar tom e voz do projeto</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <SliderTone
            id="temperature"
            value={toneAndVoice.temperature}
            onValueChange={(value) =>
              setToneAndVoice({ ...toneAndVoice, temperature: value })
            }
            label="Temperamento"
            labels={["Engraçado", "Sério"]}
          />
          <SliderTone
            id="tone"
            value={toneAndVoice.tone}
            onValueChange={(value) =>
              setToneAndVoice({ ...toneAndVoice, tone: value })
            }
            label="Tom"
            labels={["Casual", "Formal"]}
          />
          <SliderTone
            id="tone"
            value={toneAndVoice.treatment}
            onValueChange={(value) =>
              setToneAndVoice({ ...toneAndVoice, treatment: value })
            }
            label="Tratamento"
            labels={["Irreverente", "Respeitoso"]}
          />
          <SliderTone
            id="tone"
            value={toneAndVoice.style}
            onValueChange={(value) =>
              setToneAndVoice({ ...toneAndVoice, style: value })
            }
            label="Estilo"
            labels={["Enstusiasmado", "Prático"]}
          />

          <div className="flex gap-2 justify-end">
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SliderTone = ({
  id,
  value,
  onValueChange,
  label,
  labels,
}: {
  id: string;
  value: number;
  onValueChange: (value: number) => void;
  label: string;
  labels: string[];
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-sm text-muted-foreground">{value}%</span>
      </div>
      <Slider
        id={id}
        value={[value]}
        min={-3}
        max={3}
        step={1}
        onValueChange={(val) => onValueChange(val[0] ?? 0)}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </div>
    </div>
  );
};
