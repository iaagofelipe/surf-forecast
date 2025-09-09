"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, AlertTriangle, Lightbulb, Package } from "lucide-react"

interface AIAnalysisCardProps {
  analysis: {
    recommendation: string
    score: number
    bestTime: string
    tips: string[]
    warnings: string[]
    skillLevel: string
    equipment: string[]
  }
}

export function AIAnalysisCard({ analysis }: AIAnalysisCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500/20 text-green-400"
    if (score >= 60) return "bg-primary/20 text-primary"
    if (score >= 40) return "bg-accent/20 text-accent"
    return "bg-red-500/20 text-red-400"
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "iniciante":
        return "bg-green-500/20 text-green-400"
      case "intermediario":
        return "bg-accent/20 text-accent"
      case "avancado":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-accent/20 text-accent"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Análise Inteligente
          <Badge className={getScoreColor(analysis.score)}>{analysis.score}/100</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Recommendation */}
        <div className="p-3 bg-card border rounded-lg">
          <p className="font-medium text-center">{analysis.recommendation}</p>
        </div>

        {/* Best Time */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Melhor horário:</span>
          <span className="text-sm">{analysis.bestTime}</span>
        </div>

        {/* Skill Level */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Nível recomendado:</span>
          <Badge className={getSkillLevelColor(analysis.skillLevel)}>
            {analysis.skillLevel.charAt(0).toUpperCase() + analysis.skillLevel.slice(1)}
          </Badge>
        </div>

        {/* Tips */}
        {analysis.tips.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Dicas:</span>
            </div>
            <ul className="space-y-1">
              {analysis.tips.map((tip, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {analysis.warnings.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium">Atenção:</span>
            </div>
            <ul className="space-y-1">
              {analysis.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-red-400 flex items-start gap-2">
                  <span>⚠</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Equipment */}
        {analysis.equipment.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Equipamentos:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {analysis.equipment.map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
